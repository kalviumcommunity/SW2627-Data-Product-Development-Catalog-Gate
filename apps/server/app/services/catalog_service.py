from app.schemas.current_user import CurrentUser
from pathlib import Path
from uuid import UUID, uuid4

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


def get_catalog_uploads(
    current_user: CurrentUser,
    include_vendor: bool = False,
):
    select_fields = """
        *,
        reports!reports_catalog_upload_id_fkey(
            *,
            dataset_profiles!dataset_profiles_report_id_fkey(*)
        )
    """

    if include_vendor:
        select_fields = """
            *,
            users!catalog_uploads_user_id_fkey(
                id,
                name,
                user_role,
                phone
            ),
            reports!reports_catalog_upload_id_fkey(
                *,
                dataset_profiles!dataset_profiles_report_id_fkey(*)
            )
        """

    result = (
        current_user.supabase
        .table("catalog_uploads")
        .select(select_fields)
        .execute()
    )

    return result.data


def get_catalog_upload_by_id(
    current_user: CurrentUser,
    upload_id: UUID,
    include_vendor: bool = False,
):
    select_fields = """
        *,
        reports!reports_catalog_upload_id_fkey(
            *,
            dataset_profiles!dataset_profiles_report_id_fkey(*)
        )
    """

    if include_vendor:
        select_fields = """
            *,
            users!catalog_uploads_user_id_fkey(
                id,
                name,
                user_role,
                phone
            ),
            reports!reports_catalog_upload_id_fkey(
                *,
                dataset_profiles!dataset_profiles_report_id_fkey(*)
            )
        """

    result = (
        current_user.supabase
        .table("catalog_uploads")
        .select(select_fields)
        .eq("id", str(upload_id))
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=404,
            detail="Catalog upload record not found",
        )

    return result.data[0]


def get_report_by_id(
    current_user: CurrentUser,
    report_id: UUID,
):
    result = (
        current_user.supabase
        .table("reports")
        .select("""
            *,
            dataset_profiles!dataset_profiles_report_id_fkey(*)
        """)
        .eq("id", str(report_id))
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=404,
            detail="Report not found",
        )

    return result.data[0]


def get_profile_by_id(
    current_user: CurrentUser,
    profile_id: UUID,
):
    result = (
        current_user.supabase
        .table("dataset_profiles")
        .select("*")
        .eq("id", str(profile_id))
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=404,
            detail="Dataset profile not found",
        )

    return result.data[0]


def get_pending_approvals(
    current_user: CurrentUser,
    include_vendor: bool = False,
):
    """
    Get all catalog uploads with APPROVAL_NEEDED status.
    
    Args:
        current_user: Current authenticated user
        include_vendor: If True, include vendor (user) data joined on each upload
    
    Returns:
        List of pending approval upload records
    """
    select_fields = """
        *,
        reports!reports_catalog_upload_id_fkey(
            *,
            dataset_profiles!dataset_profiles_report_id_fkey(*)
        )
    """

    if include_vendor:
        select_fields = """
            *,
            users!catalog_uploads_user_id_fkey(
                id,
                name,
                user_role,
                phone
            ),
            reports!reports_catalog_upload_id_fkey(
                *,
                dataset_profiles!dataset_profiles_report_id_fkey(*)
            )
        """

    result = (
        current_user.supabase
        .table("catalog_uploads")
        .select(select_fields)
        .eq("status", "APPROVAL_NEEDED")
        .execute()
    )

    return result.data


def approve_catalog_upload(
    current_user: CurrentUser,
    upload_id: UUID,
):
    """
    Approve a catalog upload by changing status from APPROVAL_NEEDED to COMPLETED and setting approval details.
    
    Args:
        current_user: Current authenticated user (must be catalog_admin)
        upload_id: UUID of the catalog upload to approve
    
    Returns:
        Updated upload record
    """
    result = (
        current_user.supabase
        .table("catalog_uploads")
        .update({
            "status": "COMPLETED",
            "approved_by": current_user.id,
            "approval_type": "MANUAL"
        })
        .eq("id", str(upload_id))
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=404,
            detail="Catalog upload record not found",
        )

    return result.data[0]