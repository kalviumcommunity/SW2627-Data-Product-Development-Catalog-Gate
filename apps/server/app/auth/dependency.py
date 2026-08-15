from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client

from app.supabase_client import create_user_client

security = HTTPBearer()

def get_access_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    return credentials.credentials

def get_user_supabase(
    access_token: str = Depends(get_access_token),
) -> Client:
    return create_user_client(access_token)