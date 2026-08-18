from uuid import UUID
from pydantic import BaseModel
from shared.schemas.report import Report
from shared.schemas.profile import Profile


class CatalogUploadJob(BaseModel):
    id: UUID
    user_id: UUID
    tenant_id: UUID
    filepath: str
    filename: str | None = None
    status: str = "PENDING"
    error_message: str | None = None


class ReportDBInsert(BaseModel):
    user_id: UUID
    tenant_id: UUID
    catalog_upload_id: UUID
    ext: str
    total_rules: int
    total_failed_rules: int
    blocked: list[dict]
    warning: list[dict]
    outliers: list[dict]
    errors: list[str]

    @classmethod
    def from_report(
        cls,
        report: Report,
        upload_job: CatalogUploadJob | dict,
    ) -> "ReportDBInsert":
        if isinstance(upload_job, dict):
            user_id = upload_job["user_id"]
            tenant_id = upload_job["tenant_id"]
            catalog_upload_id = upload_job["id"]
        else:
            user_id = upload_job.user_id
            tenant_id = upload_job.tenant_id
            catalog_upload_id = upload_job.id

        return cls(
            user_id=user_id,
            tenant_id=tenant_id,
            catalog_upload_id=catalog_upload_id,
            ext=report.ext or "",
            total_rules=report.total_rules,
            total_failed_rules=report.total_failed_rules,
            blocked=[item.model_dump(mode="json") for item in report.blocked],
            warning=[item.model_dump(mode="json") for item in report.warning],
            outliers=[item.model_dump(mode="json") for item in report.outliers],
            errors=report.errors,
        )

    def to_db_dict(self) -> dict:
        return self.model_dump(mode="json")


class DatasetProfileDBInsert(BaseModel):
    report_id: UUID
    tenant_id: UUID
    row_count: int
    column_count: int
    duplicate_count: int
    duplicate_percentage: float
    numerical_profile: dict[str, dict]
    columns: list[dict]

    @classmethod
    def from_profile(
        cls,
        profile: Profile,
        report_id: UUID | str,
        tenant_id: UUID | str,
    ) -> "DatasetProfileDBInsert":
        numerical_dict = {
            col_name: num_profile.model_dump(mode="json")
            for col_name, num_profile in profile.numerical.items()
        }
        columns_list = [
            col_profile.model_dump(mode="json")
            for col_profile in profile.columns
        ]

        return cls(
            report_id=report_id,
            tenant_id=tenant_id,
            row_count=profile.row_count,
            column_count=profile.column_count,
            duplicate_count=profile.duplicate_count,
            duplicate_percentage=profile.duplicate_percentage,
            numerical_profile=numerical_dict,
            columns=columns_list,
        )

    def to_db_dict(self) -> dict:
        return self.model_dump(mode="json")
