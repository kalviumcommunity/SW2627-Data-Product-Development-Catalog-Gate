from app.supabase_client import supabase
from app.schemas.tenant import TenantCreate

def register_tenant(data: TenantCreate):
    response = (
        supabase
        .table("tenants")
        .insert(
            {
                "name": data.name,
                "code": data.code
            }
        )
        .execute()
    )
    return response.data[0]

def get_all_tenants():
    response = (
        supabase
        .table("tenants")
        .select("*")
        .execute()
    )
    return response.data