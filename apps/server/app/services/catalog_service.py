from apps.server.app.schemas.current_user import CurrentUser
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile, HTTPException
# from supabase import Client

BUCKET = "catalog-uploads"

async def create_catalog_upload(
    current_user: CurrentUser,
    file: UploadFile,
):
    filepath = await upload_catalog_file(
        current_user=current_user,
        file=file,
    )

    upload = create_catalog_upload_record(
        current_user=current_user,
        filepath=filepath,
    )

    return upload

async def upload_catalog_file(
    current_user: CurrentUser,
    file: UploadFile,
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File name is required",
        )

    extension = Path(file.filename).suffix.lower()
    storage_filename = f"{uuid4()}{extension}"

    user_id = current_user.id
    tenant_id = current_user.tenant_id

    storage_path = f"{tenant_id}/{user_id}/{storage_filename}"

    contents = await file.read()
    
    # print("tenant_id:", tenant_id)
    # print("user_id:", user_id)
    # print("storage_path:", storage_path)

    result = (
        current_user.supabase.storage.from_("catalog-uploads").upload(storage_path,contents, {"content-type": "text/csv",})
    )
    
    return storage_path


def create_catalog_upload_record(
    current_user: CurrentUser,
    filepath: str,
):
    result = (
        current_user.supabase
        .table("catalog_uploads")
        .insert({
            "tenant_id": current_user.tenant_id,
            "user_id": current_user.id,
            "status": "PENDING",
            "filepath": filepath,
        })
        .execute()
    )

    return result.data[0]