from fastapi import APIRouter, Depends, status, HTTPException
from supabase import Client
from app.schemas.current_user import CurrentUser
from app.auth.dependency import get_current_user
from app.services.user_service import get_all_users, get_user_by_id

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


@router.get(
    "/{user_id}",
    status_code=status.HTTP_200_OK,
)
def get_user(
    user_id: str,
    current_user: CurrentUser = Depends(get_current_user),
):
    user = get_user_by_id(current_user.supabase, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user