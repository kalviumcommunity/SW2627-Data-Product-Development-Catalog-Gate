create type upload_status as enum(
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);

create table catalog_uploads(
    -- primary key
    id uuid primary key default gen_random_uuid(),

    -- foreign key
    tenant_id uuid not null references tenants(id),
    user_id uuid not null references users(id),

    
    status upload_status not null,
    filepath text not null,

    -- timestamps
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- vendor policies
-- vendors can create uploads for themselves
CREATE POLICY vendors_can_create_uploads
ON catalog_uploads
FOR INSERT
WITH CHECK (
    auth.jwt()->>'role' = 'vendor'
    AND auth.uid() = user_id
);

-- vendors can view their own uploads
CREATE POLICY vendors_can_select_own_uploads
ON catalog_uploads
FOR SELECT
USING (
    auth.jwt()->>'role' = 'vendor'
    AND auth.uid() = user_id
);


-- catalog admins policies
-- catalog admins can view all uploads in their tenant
CREATE POLICY catalog_admins_can_select_all_uploads
ON catalog_uploads
FOR SELECT
USING (
    auth.jwt()->>'role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);

-- catalog admins can update uploads in their tenant
CREATE POLICY catalog_admins_can_update_uploads
ON catalog_uploads
FOR UPDATE
USING (
    auth.jwt()->>'role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
)
WITH CHECK (
    auth.jwt()->>'role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);

-- catalog admins can delete uploads in their tenant
CREATE POLICY catalog_admins_can_delete_uploads
ON catalog_uploads
FOR DELETE
USING (
    auth.jwt()->>'role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);

-- super_admin policies
-- super_admins can view all uploads
CREATE POLICY super_admins_can_select_all_uploads
ON catalog_uploads
FOR SELECT
USING (
    auth.jwt()->>'role' = 'super_admin'
);

-- super_admins can create any upload
CREATE POLICY super_admins_can_insert_uploads
ON catalog_uploads
FOR INSERT
WITH CHECK (
    auth.jwt()->>'role' = 'super_admin'
);

-- super_admins can update any upload
CREATE POLICY super_admins_can_update_uploads
ON catalog_uploads
FOR UPDATE
USING (
    auth.jwt()->>'role' = 'super_admin'
)
WITH CHECK (
    auth.jwt()->>'role' = 'super_admin'
);

-- super_admins can delete any upload
CREATE POLICY super_admins_can_delete_uploads
ON catalog_uploads
FOR DELETE
USING (
    auth.jwt()->>'role' = 'super_admin'
);

-- enable rls
ALTER TABLE catalog_uploads ENABLE ROW LEVEL SECURITY;