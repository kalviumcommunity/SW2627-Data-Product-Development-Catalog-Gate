from fastapi import APIRouter,status

from app.services.user_service import get_all_users
router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("",status_code=status.HTTP_200_OK)
def users():
    return get_all_users()