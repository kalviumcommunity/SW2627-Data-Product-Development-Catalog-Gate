import os
import sys
import logging

from dotenv import load_dotenv
from supabase import create_client


load_dotenv()


SUPER_ADMIN_MAIL = os.getenv("SUPER_ADMIN_MAIL")
SUPER_ADMIN_PASSWORD = os.getenv("SUPER_ADMIN_PASSWORD")
SUPER_ADMIN_NAME = os.getenv("SUPER_ADMIN_NAME")
SUPER_ADMIN_PHONE = os.getenv("SUPER_ADMIN_PHONE")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPER_ADMIN_MAIL:
    raise RuntimeError("SUPER_ADMIN_MAIL is missing")

if not SUPER_ADMIN_PASSWORD:
    raise RuntimeError("SUPER_ADMIN_PASSWORD is missing")

if not SUPER_ADMIN_NAME:
    raise RuntimeError("SUPER_ADMIN_NAME is missing")

if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL is missing")

if not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("SUPABASE_SERVICE_ROLE_KEY is missing")

# service level client to surpass rls
supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
)

logger = logging.getLogger(__name__)

CATALOGGATE_CODE = "cataloggate"

def bootstrapping():
    logger.info("Bootstrapping database...")
    logger.info("Creating Catalog Gate Tenant")
    tenant_response = (
        supabase
        .table("tenants")
        .insert({
            "name": "CatalogGate",
            "code": CATALOGGATE_CODE,
        })
        .execute()
    )
    if not tenant_response.data:
        raise RuntimeError("Failed to create tenant")

    tenant = tenant_response.data[0]
    logger.info(f"Created tenant: {tenant}")

    tenant_id = tenant["id"]

    logger.info(f"Creating superadmin: {SUPER_ADMIN_NAME}")
    auth_response = (
        supabase.auth.admin.create_user({
            "email": SUPER_ADMIN_MAIL,
            "password": SUPER_ADMIN_PASSWORD,
            "email_confirm": True,
        })
    )
    if not auth_response.user:
        raise RuntimeError(
           "Failed to create super admin Auth user"
        )

    auth_user = auth_response.user

    logger.info(f"Created Auth user: {auth_user.id}")
    logger.info(f"Creating profile for superadmin: {SUPER_ADMIN_NAME}")

    profile_response = (
        supabase
        .table("users")
        .insert({
            "id": auth_user.id,
            "tenant_id": tenant_id,
            "role": "super_admin",
            "name": SUPER_ADMIN_NAME,
            "phone": SUPER_ADMIN_PHONE,
            "email": SUPER_ADMIN_MAIL,
        })
        .execute()
    )
    if not profile_response.data:
        raise RuntimeError("Failed to create profile")
    logger.info(f"Created profile: {profile_response.data[0]}")

    logger.info("Bootstrap done!")

if __name__== '__main__':
    try:
        bootstrapping()
    except Exception as exc:
        print(f"BOOTSTRAP FAILED: {exc}")
        sys.exit(1)

