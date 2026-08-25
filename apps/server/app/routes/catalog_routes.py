from uuid import UUID
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Depends, Query, HTTPException

from app.schemas.current_user import CurrentUser
from app.auth.dependency import get_current_user
from app.services.catalog_service import (
    create_catalog_upload,
    get_catalog_uploads,
    get_catalog_upload_by_id,
    get_report_by_id,
    get_profile_by_id,
    get_pending_approvals,
    approve_catalog_upload,
)


router = APIRouter(
    prefix="/catalog",
    tags=["Catalog"]
)


@router.get("/uploads")
def get_uploads(
    vendor: Optional[bool] = Query(default=False, description="Include vendor (user) data joined on each upload"),
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_catalog_uploads(
        current_user=current_user,
        include_vendor=vendor,
    )


@router.get("/uploads/{upload_id}")
def get_upload_by_id(
    upload_id: UUID,
    vendor: Optional[bool] = Query(default=False, description="Include vendor (user) data joined on this upload"),
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_catalog_upload_by_id(
        current_user=current_user,
        upload_id=upload_id,
        include_vendor=vendor,
    )


@router.get("/reports/{report_id}")
def get_report(
    report_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_report_by_id(
        current_user=current_user,
        report_id=report_id,
    )


@router.get("/profiles/{profile_id}")
def get_profile(
    profile_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_profile_by_id(
        current_user=current_user,
        profile_id=profile_id,
    )


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
):
    # Validate file type
    valid_extensions = [".csv", ".json"]
    file_extension = file.filename[file.filename.rfind("."):].lower()
    
    if file_extension not in valid_extensions:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload CSV or JSON files."
        )
    
    # Read file content to check size
    file_content = await file.read()
    file_size = len(file_content)
    
    # Reset file pointer for subsequent reading
    await file.seek(0)
    
    # Validate file size (1KB minimum, 50MB maximum)
    if file_size < 1024:
        raise HTTPException(
            status_code=400,
            detail="File size is too small. Please upload a file larger than 1KB."
        )
    
    if file_size > 50 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds 50MB limit."
        )
    
    return await create_catalog_upload(
        current_user=current_user,
        file=file,
    )


@router.get("/approvals/pending")
def get_pending_approvals_list(
    vendor: Optional[bool] = Query(default=False, description="Include vendor (user) data joined on each upload"),
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_pending_approvals(
        current_user=current_user,
        include_vendor=vendor,
    )


@router.patch("/uploads/{upload_id}/approve")
def approve_upload(
    upload_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
):
    # Check if user has catalog_admin role
    if current_user.role != "catalog_admin":
        raise HTTPException(
            status_code=403,
            detail="Only catalog_admin can approve uploads",
        )
    
    return approve_catalog_upload(
        current_user=current_user,
        upload_id=upload_id,
    )