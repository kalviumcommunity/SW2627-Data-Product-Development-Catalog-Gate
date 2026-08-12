# Orchestrator script to run the pipeline
# Upload CSV/JSON file -> Clean Data -> Run Validation -> Run analytics -> Report using plotly and streamlit UI

# Required libs
import argparse
import logging
import os
import sys

# Required Models
from shared.schemas.rule_result_metadata import RuleResultMetadata
from shared.schemas.upload_request import UploadRequest
from shared.schemas.dataset import Dataset
from shared.schemas.profiled_dataset import ProfiledDataset
from shared.schemas.profile import Profile
from shared.schemas.severity import Severity

from ingestion.main import IngestionService
from profiling.main import ProfilingService
from validation_engine.main import ValidationEngine
from type_enforcement.main import enforce_types
from reporting.main import ReportService
from outlier_detection.main import OutlierDetectionService

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Run the data pipeline")
    parser.add_argument("file_path", type=str, help="Path to the CSV/JSON file")
    args = parser.parse_args()
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    logger = logging.getLogger(__name__)
    ingestion_service = IngestionService()
    validation_engine = ValidationEngine()
    profiling_service = ProfilingService()
    report_service = ReportService()
    outlier_detection_service = OutlierDetectionService()

    file_path = args.file_path
    info_file_ext = file_path.split('.')[-1].lower()
    info_file_encoding = 'utf-8'

    # Pre-processing validation
    if not os.path.exists(file_path):
        error = f"File not found: {file_path}"
        logger.error(error)

        report = report_service.create_report(
            filepath=file_path,
            errors=[error]
        )
        report_service.save_report(report)
        sys.exit(1)

    # Allowed formats
    if info_file_ext not in ['json', 'csv']:
        error = f"Invalid file format: {info_file_ext}"
        logger.error(error)

        report = report_service.create_report(
            filepath=file_path,
            ext=info_file_ext,
            errors=[error]
        )
        report_service.save_report(report)
        sys.exit(1)

    # Allowed encoding
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            f.read()

    except UnicodeDecodeError:
        error = f"Invalid encoding: {file_path} is not valid UTF-8."
        logger.error(error)

        report = report_service.create_report(
            filepath=file_path,
            ext=info_file_ext,
            encoding=info_file_encoding,
            errors=[error]
        )
        report_service.save_report(report)
        sys.exit(1)

    logger.info(f"Starting data pipeline for file: {file_path}")
    
    upload_request = UploadRequest(file_path=file_path)
    dataset: Dataset = ingestion_service.ingest(file_path)
    original_df = dataset.dataframe.copy()
    
    dataset.dataframe = enforce_types(dataset.dataframe)
    logger.info("Generating dataset profile...")
    dataset_profile: Profile = profiling_service.profile_dataframe(
        dataset.dataframe
    )

    outlier_reports = outlier_detection_service.find_outliers(dataset.dataframe)

   # Validation
    profiled_dataset = ProfiledDataset(
        dataframe=dataset.dataframe,
        filepath=dataset.filepath,
        profile=dataset_profile
    )

    logger.info("Running validation engine...")
    results: list[RuleResultMetadata] = validation_engine.validate(profiled_dataset)
    
    failed = [result for result in results if not result.result.passed ]

    if failed:
        logger.warning(
            f"Validation completed. "
            f"Found {len(failed)} failed rules "
            f"out of {len(results)} total rules."
        )
        for result in failed:
            msg = (
                f"Rule {result.rule.key}: "
                f"{result.rule.description} "
                f"(Failed rows: {result.result.failed_rows})"
            )
            if result.rule.severity == Severity.BLOCK:
                logger.error(msg)
            else:
                logger.warning(msg)
    else:
        logger.info(
            "Validation completed. All rules passed successfully."
        )

    # Report
    report = report_service.create_report(
        filepath=file_path,
        ext=info_file_ext,
        encoding=info_file_encoding,
        profile=dataset_profile,
        results=results,
        outliers=outlier_reports
    )

    report_path = report_service.save_report(report)

    logger.info(f"Pipeline report saved: {report_path}")
    logger.info("Pipeline processing completed successfully.")
