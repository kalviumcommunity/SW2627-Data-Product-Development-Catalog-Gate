from dataclasses import dataclass
# from pydantic import BaseModel
from supabase import Client

@dataclass
class CurrentUser():
    id: str
    tenant_id: str
    role: str
    supabase: Client