from pathlib import Path
import io

import pandas as pd

from shared.schemas.dataset import Dataset


class IngestionService:

    def ingest(
        self,
        file: bytes,
        filename: str,
    ) -> Dataset:
        """
        Reads a CSV or JSON file and returns a Dataset object.
        """

        extension = Path(filename).suffix.lower()

        if extension == ".csv":
            dataframe = self._ingest_csv(file)

        elif extension == ".json":
            dataframe = self._ingest_json(file)

        else:
            raise ValueError(
                f"Unsupported file type: {extension}"
            )

        return Dataset(
            dataframe=dataframe,
            filepath=filename,
        )

    def _ingest_csv(self, file: bytes) -> pd.DataFrame:
        return pd.read_csv(io.BytesIO(file))

    def _ingest_json(self, file: bytes) -> pd.DataFrame:
        return pd.read_json(io.BytesIO(file))