from shared.schemas.profile import Profile, ColumnProfile, NumericalProfile

class ProfilingService:
    def profile_dataframe(self, df) -> Profile:    
        row_count = df.shape[0]
        column_count = df.shape[1]

        duplicate_count = df.duplicated().sum()
        duplicate_percentage = duplicate_count / row_count * 100

        columns: list[ColumnProfile] = []
        numerical: dict[str, NumericalProfile] = {}
        for column in df.columns:
            columns.append(ColumnProfile(
                name=column,
                dtype=str(df[column].dtype),
                null_count=df[column].isnull().sum(),
                null_percentage=df[column].isnull().sum() / row_count * 100,
                unique_count=df[column].nunique()
            ))  
            if df[column].dtype in ["int64", "float64"]:
                numerical[column] = NumericalProfile(
                    min=df[column].min(),
                    max=df[column].max(),
                    mean=df[column].mean(),
                    median=df[column].median()
                )


        return Profile(
            row_count=row_count,
            column_count=column_count,
            duplicate_count=duplicate_count,
            duplicate_percentage=duplicate_percentage,
            columns=columns,
            numerical=numerical
        )
