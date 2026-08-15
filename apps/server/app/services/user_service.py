from supabase import Client

def get_all_users(supabase: Client):
    response = (
        supabase
        .table("users")
        .select("*")
        .execute()
    )

    return response.data