from supabase import Client

from app.schemas.tenant import TenantCreate

def register_tenant(
    supabase: Client,
    data: TenantCreate,
):
    response = (
        supabase
        .table("tenants")
        .insert({
            "name": data.name,
            "code": data.code,
        })
        .execute()
    )

    return response.data[0]


def get_all_tenants(
    supabase: Client,
):
    response = (
        supabase
        .table("tenants")
        .select("*")
        .execute()
    )

    return response.data


def get_tenant_by_id(supabase: Client, tenant_id: str):
    response = (
        supabase
        .table("tenants")
        .select("*")
        .eq("id", tenant_id)
        .execute()
    )

    if not response.data:
        return None

    return response.data[0]