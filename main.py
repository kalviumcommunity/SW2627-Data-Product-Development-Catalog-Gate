# Orchestrator script to run the pipeline
# Upload CSV/JSON file -> Clean Data -> Run Validation -> Run analytics -> Report using plotly and streamlit UI

# Required libs
from shared.schemas.severity import Severity
import argparse
import logging

# Required Models
from shared.schemas.rule_result_metadata import RuleResultMetadata
from shared.schemas.upload_request import UploadRequest
from shared.schemas.dataset import Dataset
from shared.schemas.profiled_dataset import ProfiledDataset
from shared.schemas.profile import Profile

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
    upload_request: UploadRequest = UploadRequest(file_path=file_path)

    dataset: Dataset = ingestion_service.ingest(file_path)
    typed_df = enforce_types(dataset.dataframe)
    original_df = dataset.dataframe.copy()
    dataset.dataframe = typed_df
    
    dataset_profile: Profile = profiling_service.profile_dataframe(dataset.dataframe)
    # print(dataset_profile)

    profiled_dataset: ProfiledDataset = ProfiledDataset(
        dataframe=dataset.dataframe,
        filepath=dataset.filepath,
        profile=dataset_profile
    )

    results: list[RuleResultMetadata] = validation_engine.validate(profiled_dataset)
    failed = [result for result in results if result.result.passed == False]
    if failed:
        logger.warning(f"Found {len(failed)} failed validations")
        for f in failed:
            if f.rule.severity == Severity.BLOCK:
                logger.error(f)
            else:
                logger.warning(f)
    else: 
        logger.info("All validations passed")

    