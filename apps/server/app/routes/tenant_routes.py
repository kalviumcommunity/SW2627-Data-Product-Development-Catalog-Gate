from app.schemas.current_user import CurrentUser
from fastapi import APIRouter, Depends, status, HTTPException

from app.auth.dependency import get_current_user
from app.schemas.tenant import TenantCreate, TenantResponse
from app.services.tenant_service import (
    register_tenant,
    get_all_tenants,
    get_tenant_by_id,
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
    current_user: CurrentUser = Depends(get_current_user),
):
    return register_tenant(
        current_user.supabase,
        data,
    )


@router.get(
    "",
    response_model=list[TenantResponse],
    status_code=status.HTTP_200_OK,
)
def get_tenants(
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_all_tenants(current_user.supabase)


@router.get(
    "/{tenant_id}",
    response_model=TenantResponse,
    status_code=status.HTTP_200_OK,
)
def get_tenant(
    tenant_id: str,
    current_user: CurrentUser = Depends(get_current_user),
):
    tenant = get_tenant_by_id(current_user.supabase, tenant_id)
    
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    return tenant