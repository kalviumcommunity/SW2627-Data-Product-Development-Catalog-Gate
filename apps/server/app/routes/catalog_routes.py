# get all for catalog records 
# get one for catalog record
    # must contain the report (repor will be joined with profile to get the profile data)

from fastapi import APIRouter
from fastapi import Depends
from app.auth.dependency import get_user_supabase
from supabase import Client

router = APIRouter(
    prefix="/catalog",
    tags=["Catalog"]
)

@router.get("/uploads")
def get_uploads(
    supabase: Client = Depends(get_user_supabase),
):
    return (
        supabase
        .table("catalog_uploads")
        .select("*")
        .execute()
        .data
    )