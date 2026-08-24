import logging
import pandas as pd
import streamlit as st

from shared.schemas.rule_result_metadata import RuleResultMetadata
from shared.schemas.dataset import Dataset
from shared.schemas.profiled_dataset import ProfiledDataset
from shared.schemas.profile import Profile
from shared.schemas.severity import Severity

from ingestion.main import IngestionService
from profiling.main import ProfilingService
from validation_engine.main import ValidationEngine
from reporting.main import ReportService
from outlier_detection.main import OutlierDetectionService

from util.enforce_types import enforce_types
from util.normalize_strings import normalize_strings


st.set_page_config(
    page_title="CatalogGate - Dashboard",
    layout="wide"
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


def show_overview(report):
    profile = report.profile

    row_count = profile.row_count
    column_count = profile.column_count
    duplicate_count = profile.duplicate_count

    total_rules = report.total_rules
    failed_rules = report.total_failed_rules

    warning_count = len(report.warning)
    blocked_count = len(report.blocked)

    outlier_count = sum(
        len(group.outliers)
        for group in report.outliers
    )

    st.subheader("Overview")

    col1, col2, col3, col4 = st.columns(4)

    col1.metric("Rows", f"{row_count:,}")
    col2.metric("Columns", column_count)
    col3.metric("Duplicates", f"{duplicate_count:,}")
    col4.metric("Outliers", f"{outlier_count:,}")

    st.divider()

    col1, col2, col3, col4 = st.columns(4)

    col1.metric("Rules", total_rules)
    col2.metric("Failed Rules", failed_rules)
    col3.metric("Warnings", warning_count)
    col4.metric("Blocked", blocked_count)

    if blocked_count > 0:
        st.error(
            "Dataset blocked. One or more blocking rules failed."
        )
    elif failed_rules > 0:
        st.warning(
            f"{failed_rules} validation rule(s) require attention."
        )
    else:
        st.success(
            "All validation rules passed successfully."
        )


def show_column_profile(report):
    st.subheader("Column Profile")

    columns = report.profile.columns

    column_data = []

    for column in columns:
        column_data.append({
            "Column": column.name,
            "Type": column.dtype,
            "Missing": column.null_count,
            "Missing %": column.null_percentage,
            "Unique": column.unique_count
        })

    df = pd.DataFrame(column_data)

    st.dataframe(
        df,
        use_container_width=True,
        hide_index=True
    )


def show_numerical_statistics(report):
    numerical = report.profile.numerical

    if not numerical:
        return

    st.subheader("Numerical Statistics")

    statistics = []

    for column_name, values in numerical.items():
        statistics.append({
            "Column": column_name,
            "Minimum": values.min,
            "Maximum": values.max,
            "Mean": values.mean,
            "Median": values.median
        })

    df = pd.DataFrame(statistics)

    st.dataframe(
        df,
        use_container_width=True,
        hide_index=True
    )


def show_warnings(report):
    warnings = report.warning

    st.subheader("Validation Warnings")

    if not warnings:
        st.success("No validation warnings.")
        return

    for item in warnings:
        rule = item.rule
        result = item.result

        title = (
            f"{rule.key} · "
            f"{rule.description}"
        )

        with st.expander(title):
            st.warning(
                result.message
            )

            failed_rows = result.failed_rows

            if failed_rows:
                st.write(
                    f"**Failed rows:** {len(failed_rows)}"
                )

                st.write(
                    f"Row indexes: {failed_rows}"
                )


def show_blocked(report):
    blocked = report.blocked

    st.subheader("Blocking Issues")

    if not blocked:
        st.success("No blocking issues.")
        return

    for item in blocked:
        rule = item.rule
        result = item.result

        with st.expander(
            f"🚫 {rule.key} · {rule.description}"
        ):
            st.error(
                result.message
            )

            failed_rows = result.failed_rows

            if failed_rows:
                st.write(
                    f"Failed rows: {failed_rows}"
                )


def show_outliers(report):
    outlier_groups = report.outliers

    st.subheader("Outliers")

    if not outlier_groups:
        st.success("No outliers detected.")
        return

    rows = []

    for group in outlier_groups:
        category = group.category
        column = group.column

        for outlier in group.outliers:
            rows.append({
                "Category": category,
                "Column": column,
                "SKU": outlier.sku,
                "Value": outlier.value,
                "Lower Bound": outlier.lower_bound,
                "Upper Bound": outlier.upper_bound
            })

    if rows:
        df = pd.DataFrame(rows)

        st.dataframe(
            df,
            use_container_width=True,
            hide_index=True
        )

st.title("CatalogGate - Dashboard")
st.write("Validation pipeline for catalog uploads.")

uploaded_file = st.file_uploader(
    "Upload your data file",
    type=["csv", "json"]
)

if uploaded_file is not None:
    file_content = uploaded_file.getvalue()
    filename = uploaded_file.name

    file_ext = (
        filename.rsplit(".", 1)[1].lower()
        if "." in filename
        else ""
    )

    ingestion_service = IngestionService()
    validation_engine = ValidationEngine()
    profiling_service = ProfilingService()
    report_service = ReportService()
    outlier_detection_service = OutlierDetectionService()

    try:
        with st.spinner("Processing dataset..."):
            logger.info("Ingesting dataset...")

            dataset: Dataset = ingestion_service.ingest(
                file=file_content,
                filename=filename
            )

            dataset.dataframe = enforce_types(
                dataset.dataframe
            )

            dataset.dataframe = normalize_strings(
                dataset.dataframe,
                columns=["category"],
                lowercase=True,
                strip=True,
                remove_special=True
            )

            dataset.dataframe = normalize_strings(
                dataset.dataframe,
                columns=["title", "brand"],
                lowercase=False,
                strip=True,
                remove_special=True
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
                profile=dataset_profile
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
                    f"Validation completed. "
                    f"Found {len(failed)} failed rules "
                    f"out of {len(results)} total rules."
                )

                for result in failed:
                    msg = (
                        f"Rule {result.rule.key}: "
                        f"{result.rule.description} "
                        f"(Failed rows: "
                        f"{result.result.failed_rows})"
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
                filepath=dataset.filepath,
                ext=file_ext,
                encoding="utf-8",
                profile=dataset_profile,
                results=results,
                outliers=outlier_reports
            )

        st.success("Report generated successfully.")

        show_overview(report)

        st.divider()

        show_column_profile(report)

        st.divider()

        show_numerical_statistics(report)

        st.divider()

        show_warnings(report)

        st.divider()

        show_blocked(report)

        st.divider()

        show_outliers(report)

    except Exception as e:
        logger.exception("Failed to process uploaded file.")
        st.error(f"Failed to process the uploaded file: {e}")