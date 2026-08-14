# Database Modelling 

There are a few points I need to keep in mind while modelling the database:
1. Our platform supports **Multi-tenancy**. This means that each tenant will have their own data and will not be able to access the data of other tenants. This means tenant_id ought to serve as the throughline for almost all the tables.
2. We will be using **Supabase** as our cloud database which is actually psql but with an abstraction layer on top.


# Entities

## Tenant

```
{
	id: uuid  # primary key 

	name: string
	code: string
}

```

### User

```
{
	id: uuid # primary key
	tenant_id: uuid # foreign key 

	role: enum
	email: string,
	phone: string
	name: string
}
```


### CatalogUpload

```
{
	id: uuid  # primary key
	user_id: uuid  # foreign key 
	tenant_id: uuid # foreign key

	status: enum
	filepath: string

	created_at: timestamptz
	updated_at: timestamptz
}
```

CatalogUpload records represent an instance of a tenant uploading their product catalog regardless of the resulting report. 

### Report

```
{
	id: uuid  # primary key
	user_id: uuid  # foreign key
	tenant_id: uuid # foreign key
	catalog_upload_id: uuid # foreign key

	generated_at: datetime
	ext: string
	encoding: string
	total_rules: int
	total_failed_rules: int

	blocked: jsonb
	warning: jsonb

	outliers: jsonb

	errors: jsonb
}
```

### DatasetProfile

```
{
	id: uuid # primary key
	report_id: uuid # foreign key
	tenant_id: uuid # foreign key

	row_count: int
	column_count: int

	duplicate_count: int
	duplicate_percentage: float

	valid_count: int
	invalid_count: int

	numerical_profile: jsonb
	columns: jsonb
}
```

# Enums

## UploadStatus

- PENDING: Upload has been received but processing has not yet started.
- PROCESSING: The catalog is currently being ingested, profiled, and validated.
- COMPLETED: Processing finished successfully and a report was generated.
- FAILED: Processing encountered an unrecoverable error.

## Role

Users would be assigned one of these three roles: vendor, catalog_admin, or superuser. 
- Superuser, as the name suggests, is essentially platform level admin. They would be able to interact with all data regardless of who is the tenant. In the real world, this may translate to employees of catalog gate. 
- Catalog admins are admins of a specific tenant. They would be able to interact with all data of their tenant.
- Vendor users are the ones who will upload the catalogs. They would only be able to interact with their own data.


## Severity

- BLOCK: Rule violation that prevents the dataset from being published. This typically includes issues that violate data quality standards or business rules.

- WARNING: Rule violation that does not prevent the dataset from being published, but is recommended to be addressed. This typically includes issues that may affect data quality but are not critical.


