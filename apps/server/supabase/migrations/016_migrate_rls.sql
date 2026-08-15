-- REASON FOR MIGRATION: Our assume 'role' column clashed with supabase' inherent role field. We renamed it to 'user_role' and updated the RLS policies accordingly.

DROP POLICY IF EXISTS vendors_can_create_uploads
ON catalog_uploads;

CREATE POLICY vendors_can_create_uploads
ON catalog_uploads
FOR INSERT
WITH CHECK (
    auth.jwt()->>'user_role' = 'vendor'
    AND auth.uid() = user_id
);


DROP POLICY IF EXISTS vendors_can_select_own_uploads
ON catalog_uploads;

CREATE POLICY vendors_can_select_own_uploads
ON catalog_uploads
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'vendor'
    AND auth.uid() = user_id
);


DROP POLICY IF EXISTS catalog_admins_can_select_all_uploads
ON catalog_uploads;

CREATE POLICY catalog_admins_can_select_all_uploads
ON catalog_uploads
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);


DROP POLICY IF EXISTS catalog_admins_can_update_uploads
ON catalog_uploads;

CREATE POLICY catalog_admins_can_update_uploads
ON catalog_uploads
FOR UPDATE
USING (
    auth.jwt()->>'user_role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
)
WITH CHECK (
    auth.jwt()->>'user_role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);


DROP POLICY IF EXISTS catalog_admins_can_delete_uploads
ON catalog_uploads;

CREATE POLICY catalog_admins_can_delete_uploads
ON catalog_uploads
FOR DELETE
USING (
    auth.jwt()->>'user_role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);


DROP POLICY IF EXISTS super_admins_can_select_all_uploads
ON catalog_uploads;

CREATE POLICY super_admins_can_select_all_uploads
ON catalog_uploads
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_insert_uploads
ON catalog_uploads;

CREATE POLICY super_admins_can_insert_uploads
ON catalog_uploads
FOR INSERT
WITH CHECK (
    auth.jwt()->>'user_role' = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_update_uploads
ON catalog_uploads;

CREATE POLICY super_admins_can_update_uploads
ON catalog_uploads
FOR UPDATE
USING (
    auth.jwt()->>'user_role' = 'super_admin'
)
WITH CHECK (
    auth.jwt()->>'user_role' = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_delete_uploads
ON catalog_uploads;

CREATE POLICY super_admins_can_delete_uploads
ON catalog_uploads
FOR DELETE
USING (
    auth.jwt()->>'user_role' = 'super_admin'
);


-- ============================================================
-- STORAGE OBJECTS
-- Originally defined in 008_create_storage_bucket.sql
-- ============================================================

DROP POLICY IF EXISTS vendors_can_upload
ON storage.objects;

CREATE POLICY vendors_can_upload
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'user_role') = 'vendor'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
    AND (storage.foldername(name))[2] = auth.uid()::text
);


DROP POLICY IF EXISTS vendors_can_read_own
ON storage.objects;

CREATE POLICY vendors_can_read_own
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'user_role') = 'vendor'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
    AND (storage.foldername(name))[2] = auth.uid()::text
);


DROP POLICY IF EXISTS catalog_admins_can_read_tenant
ON storage.objects;

CREATE POLICY catalog_admins_can_read_tenant
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'user_role') = 'catalog_admin'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
);


DROP POLICY IF EXISTS catalog_admins_can_update_tenant
ON storage.objects;

CREATE POLICY catalog_admins_can_update_tenant
ON storage.objects
FOR UPDATE
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'user_role') = 'catalog_admin'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
)
WITH CHECK (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'user_role') = 'catalog_admin'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
);


DROP POLICY IF EXISTS catalog_admins_can_delete_tenant
ON storage.objects;

CREATE POLICY catalog_admins_can_delete_tenant
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'user_role') = 'catalog_admin'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
);


DROP POLICY IF EXISTS super_admins_can_upload
ON storage.objects;

CREATE POLICY super_admins_can_upload
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'user_role') = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_read_all
ON storage.objects;

CREATE POLICY super_admins_can_read_all
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'user_role') = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_update_all
ON storage.objects;

CREATE POLICY super_admins_can_update_all
ON storage.objects
FOR UPDATE
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'user_role') = 'super_admin'
)
WITH CHECK (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'user_role') = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_delete_all
ON storage.objects;

CREATE POLICY super_admins_can_delete_all
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'user_role') = 'super_admin'
);


-- ============================================================
-- REPORTS
-- Originally defined in 009_create_report.sql
-- ============================================================

DROP POLICY IF EXISTS vendors_can_select_own_reports
ON reports;

CREATE POLICY vendors_can_select_own_reports
ON reports
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'vendor'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
    AND user_id = auth.uid()
);


DROP POLICY IF EXISTS catalog_admins_can_select_reports
ON reports;

CREATE POLICY catalog_admins_can_select_reports
ON reports
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);


DROP POLICY IF EXISTS super_admins_can_select_reports
ON reports;

CREATE POLICY super_admins_can_select_reports
ON reports
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'super_admin'
);


-- ============================================================
-- DATASET PROFILES
-- Originally defined in 010_create_profile.sql
-- ============================================================

DROP POLICY IF EXISTS vendors_can_select_own_dataset_profiles
ON dataset_profiles;

CREATE POLICY vendors_can_select_own_dataset_profiles
ON dataset_profiles
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'vendor'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
    AND EXISTS (
        SELECT 1
        FROM reports
        WHERE reports.id = dataset_profiles.report_id
          AND reports.user_id = auth.uid()
    )
);


DROP POLICY IF EXISTS catalog_admins_can_select_dataset_profiles
ON dataset_profiles;

CREATE POLICY catalog_admins_can_select_dataset_profiles
ON dataset_profiles
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);


DROP POLICY IF EXISTS super_admins_can_select_dataset_profiles
ON dataset_profiles;

CREATE POLICY super_admins_can_select_dataset_profiles
ON dataset_profiles
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'super_admin'
);


-- ============================================================
-- USERS
-- Originally defined in 011_users_policies.sql
-- ============================================================

DROP POLICY IF EXISTS vendors_can_select_own_user
ON users;

CREATE POLICY vendors_can_select_own_user
ON users
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'vendor'
    AND auth.uid() = id
);


DROP POLICY IF EXISTS vendors_can_update_own_user
ON users;

CREATE POLICY vendors_can_update_own_user
ON users
FOR UPDATE
USING (
    auth.jwt()->>'user_role' = 'vendor'
    AND auth.uid() = id
)
WITH CHECK (
    auth.jwt()->>'user_role' = 'vendor'
    AND auth.uid() = id
    AND tenant_id = (
        SELECT u.tenant_id
        FROM users u
        WHERE u.id = auth.uid()
    )
    AND user_role = 'vendor'
);


DROP POLICY IF EXISTS catalog_admins_can_select_tenant_users
ON users;

CREATE POLICY catalog_admins_can_select_tenant_users
ON users
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);


DROP POLICY IF EXISTS catalog_admins_can_update_tenant_users
ON users;

CREATE POLICY catalog_admins_can_update_tenant_users
ON users
FOR UPDATE
USING (
    auth.jwt()->>'user_role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
)
WITH CHECK (
    auth.jwt()->>'user_role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);


DROP POLICY IF EXISTS super_admins_can_select_users
ON users;

CREATE POLICY super_admins_can_select_users
ON users
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_insert_users
ON users;

CREATE POLICY super_admins_can_insert_users
ON users
FOR INSERT
WITH CHECK (
    auth.jwt()->>'user_role' = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_update_users
ON users;

CREATE POLICY super_admins_can_update_users
ON users
FOR UPDATE
USING (
    auth.jwt()->>'user_role' = 'super_admin'
)
WITH CHECK (
    auth.jwt()->>'user_role' = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_delete_users
ON users;

CREATE POLICY super_admins_can_delete_users
ON users
FOR DELETE
USING (
    auth.jwt()->>'user_role' = 'super_admin'
);


-- ============================================================
-- TENANTS
-- Originally defined in 012_tenant_policies.sql
-- ============================================================

DROP POLICY IF EXISTS vendors_can_select_own_tenant
ON tenants;

CREATE POLICY vendors_can_select_own_tenant
ON tenants
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'vendor'
    AND auth.jwt()->>'tenant_id' = id::text
);


DROP POLICY IF EXISTS catalog_admins_can_select_own_tenant
ON tenants;

CREATE POLICY catalog_admins_can_select_own_tenant
ON tenants
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = id::text
);


DROP POLICY IF EXISTS super_admins_can_select_tenants
ON tenants;

CREATE POLICY super_admins_can_select_tenants
ON tenants
FOR SELECT
USING (
    auth.jwt()->>'user_role' = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_insert_tenants
ON tenants;

CREATE POLICY super_admins_can_insert_tenants
ON tenants
FOR INSERT
WITH CHECK (
    auth.jwt()->>'user_role' = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_update_tenants
ON tenants;

CREATE POLICY super_admins_can_update_tenants
ON tenants
FOR UPDATE
USING (
    auth.jwt()->>'user_role' = 'super_admin'
)
WITH CHECK (
    auth.jwt()->>'user_role' = 'super_admin'
);


DROP POLICY IF EXISTS super_admins_can_delete_tenants
ON tenants;

CREATE POLICY super_admins_can_delete_tenants
ON tenants
FOR DELETE
USING (
    auth.jwt()->>'user_role' = 'super_admin'
);


-- ============================================================
-- SPECIAL TENANT POLICY
-- Originally modified in 014_special_tenant.sql
-- ============================================================

DROP POLICY IF EXISTS super_admins_can_insert_tenants
ON tenants;

CREATE POLICY super_admins_can_insert_tenants
ON tenants
FOR INSERT
WITH CHECK (
    auth.jwt()->>'user_role' = 'super_admin'
    AND LOWER(code) <> 'cataloggate'
);

