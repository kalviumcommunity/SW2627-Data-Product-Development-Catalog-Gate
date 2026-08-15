from fastapi import APIRouter, Depends, status
from supabase import Client

from app.auth.dependency import get_user_supabase
from app.schemas.tenant import TenantCreate, TenantResponse
from app.services.tenant_service import (
    register_tenant,
    get_all_tenants,
)

router = APIRouter(
    prefix="/tenants",
    tags=["Tenants"]
)

@router.post(
    "/register",
    response_model=TenantResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_tenant(
    data: TenantCreate,
    supabase: Client = Depends(get_user_supabase),
):
    return register_tenant(
        supabase,
        data,
    )


@router.get(
    "",
    response_model=list[TenantResponse],
    status_code=status.HTTP_200_OK,
)
def get_tenants(
    supabase: Client = Depends(get_user_supabase),
):
    return get_all_tenants(supabase)