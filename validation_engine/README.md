# Validation Engine

It is the core module of the application. It accepts a profiled dataset from the ingestion layer and run against the Out-of-box rules that CatalogGate offers.

## Providers

Currently, this is a solution rather than being an enterpise application which remains the end target. Consequently, the rules metadata exist in the filesystem. To scale this solution to an enterpise app, we may need to move these to a cloud database like supabase. To address this, we have introduced providers abstraction. In the future, we may only need to write a new supabase and replace just one line in the validation engine instead of touching that code again.

## Validation Rules

Validation Rules are ran against the dataset accepted from the ingestion layer. Validation rules can be categorized as such:

1. Field Rules: Regular schematic validation.
2. Cross-Field: Rules in relation to other fields.
3. Dataset: Dataset-levelled validation.


### Expected schema

This is largely the expected schema:

| Field          | Type    | Nullable | Example    |
| -------------- | ------- | -------- | ---------- |
| sku            | string  | No       | BK001      |
| title          | string  | No       | Clean Code |
| category       | string  | No       | Books      |
| brand          | string  | Yes      | Pearson    |
| price          | decimal | No       | 499.99     |
| currency       | string  | No       | INR        |
| stock_quantity | integer | No       | 42         |


### Out of box rules

| Rule ID | Rule Name                     | Category    | Description                                                                                     |
| ------- | ----------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| F1      | SKU Required                  | Field       | `sku` must be present and non-null.                                                             |
| F2      | SKU Format                    | Field       | `sku` must be 1-64 characters and match `^[A-Za-z0-9_-]+$`.                                     |
| F3      | Title Required                | Field       | `title` must be present and non-null.                                                           |
| F4      | Title Length                  | Field       | `title` must be 1-500 characters and contain no control characters.                             |
| F5      | Category Required             | Field       | `category` must be present and non-null.                                                        |
| F6      | Category Length               | Field       | `category` must be 1-200 characters.                                                            |
| F7      | Brand Presence                | Field       | `brand` should be present and non-null.                                                         |
| F8      | Brand Length                  | Field       | `brand` must be 1-200 characters.                                                               |
| F9      | Price Required                | Field       | `price` must be present and non-null.                                                           |
| F10     | Price Data Type               | Field       | `price` must be a numeric decimal value.                                                        |
| F11     | Price Range                   | Field       | `price` must be greater than 0 and less than or equal to 9,999,999.99.                          |
| F12     | Price Precision               | Field       | `price` must not exceed two decimal places.                                                     |
| F13     | Currency Required             | Field       | `currency` must be present and non-null.                                                        |
| F14     | Currency Format               | Field       | `currency` must match the ISO 4217 three-letter uppercase format (`^[A-Z]{3}$`).                |
| F15     | Stock Quantity Required       | Field       | `stock_quantity` must be present and non-null.                                                  |
| F16     | Stock Quantity Data Type      | Field       | `stock_quantity` must be an integer.                                                            |
| F17     | Stock Quantity Range          | Field       | `stock_quantity` must be greater than or equal to 0.                                            |
| F18     | Stock Quantity Sanity Limit   | Field       | `stock_quantity` must not exceed 999,999,999.                                                   |
| C1      | Price/Currency Co-presence    | Cross-Field | `price` and `currency` must either both be present or both be absent.                           |
| C2      | SKU/Category Consistency      | Cross-Field | If `sku` contains a recognizable category token, it must be consistent with `category`.         |
| C3      | Category Currency Consistency | Cross-Field | Products belonging to the same `category` should use the same `currency`; outliers are flagged. |
| D1      | SKU Uniqueness                | Dataset     | Every `sku` must be unique across the dataset.                                                  |
| D2      | Duplicate Product Detection   | Dataset     | Detect probable duplicate products using fuzzy similarity on `(title, brand, category)`.        |
| D3      | Category Normalization        | Dataset     | Detect inconsistent category values such as `Books`, `books`, and `Book`.                       |
| D4      | Brand Normalization           | Dataset     | Detect inconsistent brand values such as `Apple`, `APPLE`, and `Apple Inc.`.                    |
