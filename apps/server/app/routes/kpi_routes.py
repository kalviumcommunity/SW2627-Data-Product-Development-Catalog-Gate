from typing import Optional
from fastapi import APIRouter, Depends, Query

from app.schemas.current_user import CurrentUser
from app.auth.dependency import get_current_user
from app.services.kpi_service import (
    jobs_by_status,
    find_active_vendors,
    return_upload_count_daywise_for_last_n_days,
    return_health,
)


router = APIRouter(
    prefix="/kpi",
    tags=["KPI"]
)


@router.get("/jobs-by-status")
def get_jobs_by_status(
    status: str = Query(..., description="Status to filter by (e.g., 'PENDING', 'APPROVAL_NEEDED', 'COMPLETED', 'FAILED', 'REJECTED')"),
    count_only: bool = Query(default=False, description="Return only the count of jobs"),
    current_user: CurrentUser = Depends(get_current_user),
):
    return jobs_by_status(
        current_user=current_user,
        status=status,
        return_count_only=count_only,
    )


@router.get("/active-vendors")
def get_active_vendors(
    count_only: bool = Query(default=False, description="Return only the count of active vendors"),
    current_user: CurrentUser = Depends(get_current_user),
):
    return find_active_vendors(
        current_user=current_user,
        return_count_only=count_only,
    )


@router.get("/upload-counts")
def get_upload_counts_daywise(
    n_days: int = Query(default=30, description="Number of days to look back (default: 30)"),
    current_user: CurrentUser = Depends(get_current_user),
):
    return return_upload_count_daywise_for_last_n_days(
        current_user=current_user,
        n_days=n_days,
    )


@router.get("/health")
def get_health(
    current_user: CurrentUser = Depends(get_current_user),
):
    return return_health(current_user=current_user)
