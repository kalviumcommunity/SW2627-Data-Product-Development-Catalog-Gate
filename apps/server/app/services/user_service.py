from supabase import Client

def get_all_users(supabase: Client):
    response = (
        supabase
        .table("users")
        .select("*")
        .execute()
    )

    return response.data


def get_user_by_id(supabase: Client, user_id: str):
    response = (
        supabase
        .table("users")
        .select("*")
        .eq("id", user_id)
        .execute()
    )

    if not response.data:
        return None

    return response.data[0]