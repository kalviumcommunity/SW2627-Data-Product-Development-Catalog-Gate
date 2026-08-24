ALTER TABLE catalog_uploads
ADD COLUMN IF NOT EXISTS approved_by UUID
REFERENCES users(id)
ON DELETE SET NULL;

ALTER TABLE catalog_uploads
ADD COLUMN IF NOT EXISTS approval_type TEXT
DEFAULT 'AUTOMATIC';

ALTER TABLE catalog_uploads
ADD CONSTRAINT catalog_uploads_approval_type_check
CHECK (approval_type IN ('MANUAL', 'AUTOMATIC'));