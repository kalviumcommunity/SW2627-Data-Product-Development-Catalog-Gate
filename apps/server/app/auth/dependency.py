from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.schemas.current_user import CurrentUser
from app.supabase_client import create_user_client


security = HTTPBearer()


def get_access_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    return credentials.credentials


def get_current_user(
    access_token: str = Depends(get_access_token),
) -> CurrentUser:
    supabase = create_user_client(access_token)

    response = supabase.auth.get_claims(access_token)
    claims = response["claims"]

    return CurrentUser(
        id=claims["sub"],
        tenant_id=claims["tenant_id"],
        role=claims["user_role"],
        supabase=supabase,
    )