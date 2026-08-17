import asyncio
import logging
import sys
from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = SERVER_DIR.parent.parent

if str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.supabase_client import service_supabase

from ingestion.main import IngestionService
from profiling.main import ProfilingService
from validation_engine.main import ValidationEngine
from reporting.main import ReportService
from outlier_detection.main import OutlierDetectionService

from shared.schemas.rule_result_metadata import RuleResultMetadata
from shared.schemas.dataset import Dataset
from shared.schemas.profiled_dataset import ProfiledDataset
from shared.schemas.profile import Profile
from shared.schemas.severity import Severity

from util.enforce_types import enforce_types
from util.normalize_strings import normalize_strings


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

CATALOG_UPLOADS_BUCKET = "catalog-uploads"
POLL_INTERVAL_SECONDS = 10


def get_next_upload():
    result = (
        service_supabase
        .rpc("claim_next_catalog_upload")
        .execute()
    )

    if not result.data:
        return None

    if isinstance(result.data, list):
        return result.data[0] if result.data else None

    return result.data


def download_upload(upload_job: dict) -> bytes:
    filepath = upload_job["filepath"]
    logger.info(
        "Downloading upload %s from storage: %s",
        upload_job["id"],
        filepath,
    )
    return (
        service_supabase
        .storage
        .from_(CATALOG_UPLOADS_BUCKET)
        .download(filepath)
    )


def get_file_extension(filepath: str) -> str:
    return Path(filepath).suffix.lower().lstrip(".")


def process_upload(
    upload_job: dict,
    ingestion_service: IngestionService,
    validation_engine: ValidationEngine,
    profiling_service: ProfilingService,
    report_service: ReportService,
    outlier_detection_service: OutlierDetectionService,
):

    filepath = upload_job["filepath"]
    extension = get_file_extension(filepath)
    encoding = "utf-8"

    logger.info(
        "Processing upload %s: %s",
        upload_job["id"],
        filepath,
    )

    file_content = download_upload(upload_job)

    if extension not in {"csv", "json"}:
        raise ValueError(
            f"Unsupported file format: {extension}"
        )

    dataset: Dataset = ingestion_service.ingest(
        file=file_content,
        filename=filepath,
    )

    dataset.dataframe = enforce_types(
        dataset.dataframe
    )

    dataset.dataframe = normalize_strings(
        dataset.dataframe,
        columns=["category"],
        lowercase=True,
        strip=True,
        remove_special=True,
    )

    dataset.dataframe = normalize_strings(
        dataset.dataframe,
        columns=["title", "brand"],
        lowercase=False,
        strip=True,
        remove_special=True,
    )

    logger.info("Generating dataset profile...")

    dataset_profile: Profile = (
        profiling_service.profile_dataframe(
            dataset.dataframe
        )
    )
    logger.info("Detecting outliers...")

    outlier_reports = (
        outlier_detection_service.find_outliers(
            dataset.dataframe
        )
    )

    profiled_dataset = ProfiledDataset(
        dataframe=dataset.dataframe,
        filepath=dataset.filepath,
        profile=dataset_profile,
    )

    logger.info("Running validation engine...")

    results: list[RuleResultMetadata] = (
        validation_engine.validate(
            profiled_dataset
        )
    )

    failed = [
        result
        for result in results
        if not result.result.passed
    ]

    if failed:
        logger.warning(
            "Validation completed. Found %d failed rules "
            "out of %d total rules.",
            len(failed),
            len(results),
        )

        for result in failed:
            msg = (
                f"Rule {result.rule.key}: "
                f"{result.rule.description} "
                f"(Failed rows: {result.result.failed_rows})"
            )

            if result.rule.severity == Severity.BLOCK:
                logger.error(msg)
            else:
                logger.warning(msg)

    else:
        logger.info(
            "Validation completed. "
            "All rules passed successfully."
        )


    report = report_service.create_report(
        filepath=filepath,
        ext=extension,
        encoding=encoding,
        profile=dataset_profile,
        results=results,
        outliers=outlier_reports,
    )

    report_path = report_service.save_report(report)

    logger.info(
        "Pipeline report saved: %s",
        report_path,
    )

    logger.info(
        "Pipeline processing completed successfully "
        "for upload %s.",
        upload_job["id"],
    )

    return report_path


async def main():

    ingestion_service = IngestionService()
    validation_engine = ValidationEngine()
    profiling_service = ProfilingService()
    report_service = ReportService()
    outlier_detection_service = OutlierDetectionService()

    logger.info("Starting validation worker...")
    while True:
        upload_job = get_next_upload()

        if not upload_job:
            logger.debug(
                "No pending uploads. Sleeping for %s seconds...",
                POLL_INTERVAL_SECONDS,
            )

            await asyncio.sleep(
                POLL_INTERVAL_SECONDS
            )

            continue
        try:
            logger.info(
                "Claimed upload job: %s",
                upload_job["id"],
            )

            process_upload(
                upload_job=upload_job,
                ingestion_service=ingestion_service,
                validation_engine=validation_engine,
                profiling_service=profiling_service,
                report_service=report_service,
                outlier_detection_service=outlier_detection_service,
            )

            (
                service_supabase
                .table("catalog_uploads")
                .update({
                    "status": "COMPLETED",
                })
                .eq("id", upload_job["id"])
                .execute()
            )

            logger.info(
                "Upload %s marked as COMPLETED.",
                upload_job["id"],
            )

        except Exception as e:

            logger.exception(
                "Failed to process upload %s: %s",
                upload_job["id"],
                str(e),
            )

            try:
                (
                    service_supabase
                    .table("catalog_uploads")
                    .update({
                        "status": "FAILED",
                    })
                    .eq("id", upload_job["id"])
                    .execute()
                )

                logger.info(
                    "Upload %s marked as FAILED.",
                    upload_job["id"],
                )

            except Exception:
                logger.exception(
                    "Failed to mark upload %s as FAILED.",
                    upload_job["id"],
                )


if __name__ == "__main__":
    asyncio.run(main())