from fastapi import APIRouter, status
from app.schemas.tenant import TenantCreate, TenantResponse
from app.services.tenant_service import (
    register_tenant,
    get_all_tenants
)
router = APIRouter(
    prefix="/tenants",
    tags=["Tenants"]
)

@router.post(
    "/register",
    response_model=TenantResponse,
    status_code=status.HTTP_201_CREATED
)
def create_tenant(data: TenantCreate):
    return register_tenant(data)

@router.get(
    "",
    status_code=status.HTTP_200_OK
)
def get_tenants():
    return get_all_tenants()