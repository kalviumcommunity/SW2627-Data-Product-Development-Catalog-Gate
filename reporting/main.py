from shared.schemas.cat_outlier_report import CategoryOutlierReport
from datetime import datetime, timezone

from shared.schemas.report import Report
from shared.schemas.profile import Profile
from shared.schemas.rule_result_metadata import RuleResultMetadata
from shared.schemas.severity import Severity


class ReportService:

    def create_report(
        self,
        filepath: str | None = None,
        ext: str | None = None,
        encoding: str | None = None,
        profile: Profile | None = None,
        results: list[RuleResultMetadata] | None = None,
        outliers: list[CategoryOutlierReport] | None = None,
        errors: list[str] | None = None,
    ) -> Report:

        results = results or []
        failed = [r for r in results if not r.result.passed]

        return Report(
            generated_at=datetime.now(timezone.utc),
            filepath=filepath,
            ext=ext,
            encoding=encoding,
            profile=profile,
            total_rules=len(results),
            total_failed_rules=len(failed),
            blocked=[
                r for r in failed
                if r.rule.severity == Severity.BLOCK
            ],
            warning=[
                r for r in failed
                if r.rule.severity == Severity.WARNING
            ],
            outliers=outliers or [],
            errors=errors or [],
        )

    def save_report(self, report: Report) -> str:
        timestamp = report.generated_at.strftime("%Y%m%dT%H%M%SZ")
        report_path = f"report_{timestamp}.json"

        with open(report_path, "w", encoding="utf-8") as f:
            f.write(report.model_dump_json(indent=2))

        return report_path