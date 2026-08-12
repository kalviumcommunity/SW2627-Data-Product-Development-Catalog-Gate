from shared.schemas.cat_outlier_report import CategoryOutlierReport, Outlier
import pandas as pd

class OutlierDetectionService:
    def find_outliers(self, df: pd.DataFrame) -> list[CategoryOutlierReport]:
        outlier_reports: list[CategoryOutlierReport] = []
        for category, group in df.groupby('category'):
            for column in ['price', 'stock_quantity']:
                q1 = group[column].quantile(0.25)
                q3 = group[column].quantile(0.75)
                iqr = q3 - q1

                lower_bound = q1 - 1.5 * iqr
                upper_bound = q3 + 1.5 * iqr

                outliers = group[
                    (group[column] < lower_bound) |
                    (group[column] > upper_bound)
                ]

                if not outliers.empty:
                    outlier_reports.append(
                    CategoryOutlierReport(
                        category=category,
                        column=column,
                        outliers=[
                            Outlier(
                                sku=row["sku"],
                                value=row[column],
                                lower_bound=lower_bound,
                                upper_bound=upper_bound,
                            )
                            for _, row in outliers.iterrows()
                        ],
                    )
                )
        
        return outlier_reports
