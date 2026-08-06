from pathlib import Path
from ingestion.main import IngestionService


def print_dataset_info(dataset):
    print("\n" + "=" * 60)
    print(f"File: {dataset.filepath}")
    print("=" * 60)

    print("\nShape:")
    print(dataset.dataframe.shape)

    print("\nData Types:")
    print(dataset.dataframe.dtypes)

    print("\nFirst 5 Rows:")
    print(dataset.dataframe.head())

    print("\nComplete DataFrame:")
    print(dataset.dataframe)


def main():
    ingestion_service = IngestionService()

    test_dir = Path(__file__).parent / "tests"

    # Test CSV ingestion
    csv_dataset = ingestion_service.ingest(str(test_dir / "test.csv"))
    print_dataset_info(csv_dataset)

    # Test JSON ingestion
    json_dataset = ingestion_service.ingest(str(test_dir / "test.json"))
    print_dataset_info(json_dataset)


if __name__ == "__main__":
    main()