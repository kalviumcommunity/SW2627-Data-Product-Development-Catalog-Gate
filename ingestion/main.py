from pathlib import Path
import pandas as pd
from shared.schemas.dataset import Dataset

class IngestionService:
    def ingest(self,file_path:str) -> Dataset:
        self.file_path = Path(file_path)
        """
        Reads a CSV or JSON file and returns a Dataset object.
        """

        if not self.file_path.exists():
            raise FileNotFoundError(
                f"{self.file_path} does not exist."
            )

        extension = self.file_path.suffix.lower()

        if extension == ".csv":
            dataframe = self._ingest_csv()

        elif extension == ".json":
            dataframe = self._ingest_json()

        else:
            raise ValueError(
                f"Unsupported file type: {extension}"
            )

        return Dataset(
            dataframe=dataframe,
            filepath=str(self.file_path)
        )

    def _ingest_csv(self) -> pd.DataFrame:
        return pd.read_csv(self.file_path)

    def _ingest_json(self) -> pd.DataFrame:
        return pd.read_json(self.file_path)