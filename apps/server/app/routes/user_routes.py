from fastapi import APIRouter, Depends, status
from supabase import Client

from app.auth.dependency import get_user_supabase
from app.services.user_service import get_all_users

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.get(
    "",
    status_code=status.HTTP_200_OK,
)
def get_users(
    supabase: Client = Depends(get_user_supabase),
):
    return get_all_users(supabase)