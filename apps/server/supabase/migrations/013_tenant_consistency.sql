-- To let the data model make sense, we need to enforce these invariants:
-- upload.user_id.tenant_id = upload.tenant_id
-- report.user_id.tenant_id = report.tenant_id
-- report.catalog_upload.tenant_id = report.tenant_id
-- profile.report.tenant_id = profile.tenant_id

-- these constraint would enforce this

-- users.id is already the primary key.
-- This additional unique constraint allows other tables
-- to reference the (id, tenant_id) pair.
ALTER TABLE users
ADD CONSTRAINT users_id_tenant_unique
UNIQUE (id, tenant_id);

-- Allows reports to reference (upload_id, tenant_id)
-- as a composite foreign key.
ALTER TABLE catalog_uploads
ADD CONSTRAINT catalog_uploads_id_tenant_unique
UNIQUE (id, tenant_id);

-- Enforces:
-- upload.user_id.tenant_id = upload.tenant_id
ALTER TABLE catalog_uploads
ADD CONSTRAINT catalog_uploads_user_tenant_fk
FOREIGN KEY (user_id, tenant_id)
REFERENCES users(id, tenant_id);

-- Allows dataset_profiles to reference
-- (report_id, tenant_id).
ALTER TABLE reports
ADD CONSTRAINT reports_id_tenant_unique
UNIQUE (id, tenant_id);

-- Enforces:
-- report.user_id.tenant_id = report.tenant_id
ALTER TABLE reports
ADD CONSTRAINT reports_user_tenant_fk
FOREIGN KEY (user_id, tenant_id)
REFERENCES users(id, tenant_id);

-- Enforces:
-- report.catalog_upload.tenant_id = report.tenant_id
ALTER TABLE reports
ADD CONSTRAINT reports_upload_tenant_fk
FOREIGN KEY (catalog_upload_id, tenant_id)
REFERENCES catalog_uploads(id, tenant_id);

-- Enforces:
-- profile.report.tenant_id = profile.tenant_id
ALTER TABLE dataset_profiles
ADD CONSTRAINT dataset_profiles_report_tenant_fk
FOREIGN KEY (report_id, tenant_id)
REFERENCES reports(id, tenant_id);