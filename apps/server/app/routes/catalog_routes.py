# get all for catalog records 
# get one for catalog record
    # must contain the report (repor will be joined with profile to get the profile data)

from app.schemas.current_user import CurrentUser
from fastapi import APIRouter, UploadFile, File
from fastapi import Depends
from supabase import Client

from app.auth.dependency import get_current_user
from app.services.catalog_service import create_catalog_upload


router = APIRouter(
    prefix="/catalog",
    tags=["Catalog"]
)

@router.get("/uploads")
def get_uploads(
    current_user: CurrentUser = Depends(get_current_user),
):
    return (
        current_user.supabase
        .table("catalog_uploads")
        .select("*")
        .execute()
        .data
    )

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
):
    return await create_catalog_upload(
        current_user=current_user,
        file=file,
    )