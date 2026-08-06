from main import IngestionService

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
    # Test CSV ingestion
    csv_dataset = ingestion_service.ingest("tests/test.csv")
    print_dataset_info(csv_dataset)
    # Test JSON ingestion
    json_dataset = ingestion_service.ingest("tests/test.json")
    print_dataset_info(json_dataset)

if __name__ == "__main__":
    main()
