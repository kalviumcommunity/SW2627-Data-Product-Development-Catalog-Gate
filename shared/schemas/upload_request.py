from pydantic import BaseModel, Field
from uuid import UUID

class UploadRequest(BaseModel):
    file_path: str
