from fastapi import HTTPException

from app.supabase_client import supabase


def register_user(data):
    # 1. Create user in Supabase Auth
    auth_response = (
        supabase.auth.sign_up(
            {
                "email": data.email,
                "password": data.password
            }
        )
    )
    if not auth_response.user:
        raise HTTPException(
            status_code=400,
            detail="User registration failed"
        )
    auth_user = auth_response.user
    # 2. Create user profile
    profile_response = (
        supabase
        .table("users")
        .insert(
            {
                "id": auth_user.id,
                "tenant_id": str(data.tenant_id),
                "role": data.role.value,
                "name": data.name,
                "phone": data.phone,
                "email": data.email
            }
        )
        .execute()
    )
    return profile_response.data[0]

def login_user(data):
    response = (
        supabase.auth.sign_in_with_password(
            {
                "email": data.email,
                "password": data.password
            }
        )
    )
    if not response.session:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    return {
        "access_token": response.session.access_token,
        "refresh_token": response.session.refresh_token,
        "user": response.user
    }