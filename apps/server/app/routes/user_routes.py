from fastapi import APIRouter, Depends, status
from supabase import Client
from app.schemas.current_user import CurrentUser
from app.auth.dependency import get_current_user
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
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_all_users(current_user.supabase)