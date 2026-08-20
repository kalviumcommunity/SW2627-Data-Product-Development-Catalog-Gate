from fastapi import APIRouter, Depends, status
from app.schemas.current_user import CurrentUser
from app.auth.dependency import get_current_user
import json
import os

router = APIRouter(
    prefix="/validation-rules",
    tags=["Validation Rules"]
)

# Path to the metadata.json file
METADATA_PATH = os.path.join(
    "validation_engine",
    "providers",
    "fs_metadata",
    "metadata.json"
)

# console.log(METADATA_PATH)

@router.get(
    "",
    status_code=status.HTTP_200_OK,
)
def get_validation_rules(
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        with open(METADATA_PATH, 'r') as f:
            rules = json.load(f)
        return rules
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []
