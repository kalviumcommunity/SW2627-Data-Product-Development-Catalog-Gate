from app.supabase_client import supabase

def get_all_users():
    response = (
        supabase
        .table("users")
        .select("*")
        .execute()
    )
    return response.data