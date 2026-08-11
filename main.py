# Orchestrator script to run the pipeline
# Upload CSV/JSON file -> Clean Data -> Run Validation -> Run analytics -> Report using plotly and streamlit UI

# Required libs
import argparse
import logging
import json
from datetime import datetime, timezone

# Required Models
from shared.schemas.rule_result_metadata import RuleResultMetadata
from shared.schemas.upload_request import UploadRequest
from shared.schemas.dataset import Dataset
from shared.schemas.profiled_dataset import ProfiledDataset
from shared.schemas.profile import Profile
from shared.schemas.report import Report
from shared.schemas.severity import Severity

# Services
from ingestion.main import IngestionService
from profiling.main import ProfilingService
from validation_engine.main import ValidationEngine
from type_enforcement.main import enforce_types

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
    
    file_path = args.file_path
    logger.info(f"Starting data pipeline for file: {file_path}")
    upload_request: UploadRequest = UploadRequest(file_path=file_path)

    dataset: Dataset = ingestion_service.ingest(file_path)
    typed_df = enforce_types(dataset.dataframe)
    original_df = dataset.dataframe.copy()
    dataset.dataframe = typed_df
    
    logger.info("Generating dataset profile...")
    dataset_profile: Profile = profiling_service.profile_dataframe(dataset.dataframe)

    profiled_dataset: ProfiledDataset = ProfiledDataset(
        dataframe=dataset.dataframe,
        filepath=dataset.filepath,
        profile=dataset_profile
    )

    logger.info("Running validation engine...")
    results: list[RuleResultMetadata] = validation_engine.validate(profiled_dataset)
    failed = [result for result in results if result.result.passed == False]

    if failed:
        logger.warning(f"Validation completed. Found {len(failed)} failed rules out of {len(results)} total rules:")
        for result in failed:
            msg = f"Rule {result.rule.key} [{result.rule.key}]: {result.rule.description} (Failed rows: {result.result.failed_rows})"
            if result.rule.severity == Severity.BLOCK:
                logger.error(msg)
            else:
                logger.warning(msg)
    else:
        logger.info("Validation completed. All rules passed successfully.")

    timestamp = datetime.now(timezone.utc)

    report = Report(
        generated_at=timestamp,
        profile=dataset_profile,
        total_rules=len(results),
        total_failed_rules=len(failed),
        blocked=[result for result in failed if result.rule.severity == Severity.BLOCK],
        warning=[result for result in failed if result.rule.severity == Severity.WARNING]
    )

    report_path = f"report_{timestamp}.json"
    logger.info(f"Generating pipeline report: {report_path}")
    with open(report_path, "w") as f:
        f.write(report.model_dump_json(indent=2))
    logger.info("Pipeline processing completed successfully.")

