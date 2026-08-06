# Orchestrator script to run the pipeline
# Upload CSV/JSON file -> Clean Data -> Run Validation -> Run analytics -> Report using plotly and streamlit UI

from shared.schemas.upload_request import UploadRequest
from shared.schemas.dataset import Dataset
from shared.schemas.validation_rule import ValidationRule

# Run pipeline from here