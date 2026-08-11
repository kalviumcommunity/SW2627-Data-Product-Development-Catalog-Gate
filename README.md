# CatalogGate 

CatalogGate is a data quality validation engine for marketplace catalogs. It validates vendor product submissions before they are published, detects data quality issues, and generates actionable validation reports so incorrect catalog data never reaches customers.

---

## Architecture & Pipeline Flow

CatalogGate processes data files through a structured, multi-stage pipeline:

### 1. Ingestion
* **Service:** [IngestionService](file:///home/suub/IdeaProjects/SW2627-Data-Product-Development-Catalog-Gate/ingestion/main.py)
* Accepts files with `.csv` or `.json` extensions.
* Uses Pandas (`read_csv` and `read_json`) to load data into a unified `Dataset` format.

### 2. Type Enforcement
* **Service:** [enforce_types](file:///home/suub/IdeaProjects/SW2627-Data-Product-Development-Catalog-Gate/type_enforcment/main.py)
* Dynamically parses numeric columns (`price`, `stock_quantity`) using `pd.to_numeric(..., errors="coerce")`.
* Converts text-wrapped numbers into standard float representations and coerces invalid/malformed text (like `"bad price"` or `"N/A"`) into `NaN`.

### 3. Profiling
* **Service:** [ProfilingService](file:///home/suub/IdeaProjects/SW2627-Data-Product-Development-Catalog-Gate/profiling/main.py)
* Performs dataset-wide analysis to calculate:
  * Total rows and column counts
  * Duplicate percentages
  * Column-specific metrics (null counts, null percentages, uniqueness)
  * Numerical metrics (min, max, mean, median) for numeric fields

### 4. Validation
* **Engine:** [ValidationEngine](file:///home/suub/IdeaProjects/SW2627-Data-Product-Development-Catalog-Gate/validation_engine/main.py)
* Executes 18 out-of-the-box validation rules divided by severity:
  * **WARNING**: Non-blocking issues like missing brand values or long brand descriptions.
  * **BLOCK**: Critical schema violations like missing price, non-decimal price, or invalid stock quantity types.

### 5. Logging & Reporting
* **Console Logs:** Active logging to standard output with timestamp, logging levels (`INFO`, `WARNING`, `ERROR`), and row-level failure indications.
* **JSON Reports:** A structured report saving to the root directory as `report_<timestamp>.json` containing generated metadata, complete profiling statistics, and categorized lists of blocked/warned violations.

---

## Project Structure

```
.
├── ingestion/          # Data loading & initial format validation
├── profiling/          # Data profiling & statistical analysis
├── type_enforcment/    # Safe numeric coercion layer
├── validation_engine/  # Validation rules registry & implementation modules
│   └── impl/           # The 18 individual rule checking modules
├── shared/             # Shared entities
│   └── schemas/        # Pydantic schemas (Report, Dataset, RuleResult, etc.)
├── main.py             # Pipeline Orchestrator Entrypoint
├── requirements.txt    # Project dependencies
├── test.csv            # Sample dataset with errors/edge cases
└── test.json           # Sample JSON dataset
```

---

## 🛠️ Setup & Installation

### Prerequisites
* Python 3.11+
* Virtual Environment tools (`venv`)

### 1. Clone & Navigate
```bash
git clone https://github.com/kalviumcommunity/SW2627-Data-Product-Development-Catalog-Gate.git
cd SW2627-Data-Product-Development-Catalog-Gate
```

### 2. Create and Activate Virtual Environment

**Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```powershell
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## Running the Pipeline

Validate any dataset by passing the file path to the orchestrator:

```bash
python main.py test.csv
```

### Example Log Output
```text
2026-08-11 10:40:38,493 - __main__ - INFO - Starting data pipeline for file: test.csv
2026-08-11 10:40:38,496 - __main__ - INFO - Ingested dataset. Rows: 8, Columns: ['sku', 'title', 'category', 'brand', 'price', 'currency', 'stock_quantity']
2026-08-11 10:40:38,496 - __main__ - INFO - Enforcing data types on columns...
2026-08-11 10:40:38,497 - __main__ - INFO - Generating dataset profile...
2026-08-11 10:40:38,503 - __main__ - INFO - Running validation engine...
2026-08-11 10:40:38,517 - __main__ - WARNING - Validation completed. Found 6 failed rules out of 18 total rules:
2026-08-11 10:40:38,517 - __main__ - WARNING - Rule F7 [F7]: Brand should be present and non-null. (Failed rows: [3])
2026-08-11 10:40:38,517 - __main__ - WARNING - Rule F8 [F8]: Brand must be 1-200 characters. (Failed rows: [3])
2026-08-11 10:40:38,517 - __error__   - Rule F9 [F9]: Price must be present and non-null. (Failed rows: [7])
2026-08-11 10:40:38,517 - __error__   - Rule F10 [F10]: Price must be a numeric decimal value. (Failed rows: [7])
2026-08-11 10:40:38,517 - __error__   - Rule F15 [F15]: Stock quantity must be present and non-null. (Failed rows: [7])
2026-08-11 10:40:38,517 - __error__   - Rule F16 [F16]: Stock quantity must be an integer. (Failed rows: [7])
2026-08-11 10:40:38,517 - __main__ - INFO - Generating pipeline report: report_2026-08-11 05:10:38.517621+00:00.json
2026-08-11 10:40:38,518 - __main__ - INFO - Pipeline processing completed successfully.
```

---

## Actionable Reports

The JSON report (`report_<timestamp>.json`) output contains structured information designed to be consumed by upstream databases or UI interfaces (e.g., Streamlit/Plotly).

### Report Structure Overview
```json
{
  "generated_at": "2026-08-11T05:08:41.424170Z",
  "profile": {
    "row_count": 8,
    "column_count": 7,
    "duplicate_count": 0,
    "duplicate_percentage": 0.0,
    "columns": [ ... ],
    "numerical": { ... }
  },
  "total_rules": 18,
  "total_failed_rules": 6,
  "blocked": [
    {
      "rule": { "key": "F9", "description": "Price must be present and non-null.", "severity": "BLOCK" },
      "result": { "passed": false, "failed_rows": [7], "message": "Price is required." }
    }
  ],
  "warning": [
    {
      "rule": { "key": "F7", "description": "Brand should be present and non-null.", "severity": "WARNING" },
      "result": { "passed": false, "failed_rows": [3], "message": "Brand is required." }
    }
  ]
}
```
