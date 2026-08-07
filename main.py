# Orchestrator script to run the pipeline
# Upload CSV/JSON file -> Clean Data -> Run Validation -> Run analytics -> Report using plotly and streamlit UI

import argparse
import logging

# Required Models
from shared.schemas.upload_request import UploadRequest
from shared.schemas.dataset import Dataset

# Services
from ingestion.main import IngestionService

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
    
    file_path = args.file_path
    upload_request: UploadRequest = UploadRequest(file_path=file_path)

    dataset: Dataset = ingestion_service.ingest(file_path)
    logger.info(dataset) 
    