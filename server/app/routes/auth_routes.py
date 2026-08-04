from fastapi import APIRouter, status
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
)
from app.services.auth_service import (
    register_user,
    login_user
)
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
def register(data: RegisterRequest):
    return register_user(data)

@router.post(
    "/login",
    status_code=status.HTTP_200_OK
)
def login(data: LoginRequest):
    return login_user(data)