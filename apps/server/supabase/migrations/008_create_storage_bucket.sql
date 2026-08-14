INSERT INTO storage.buckets (id, name, public)
VALUES ('catalog-uploads', 'catalog-uploads', false);


-- vendor policies
-- vendors can upload files to their own tenant/user folder.
--
-- Expected path:
-- tenant_id/user_id/filename
CREATE POLICY "vendors_can_upload"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'role') = 'vendor'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
    AND (storage.foldername(name))[2] = auth.uid()::text
);


-- vendors can read their own files.
CREATE POLICY "vendors_can_read_own"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'role') = 'vendor'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
    AND (storage.foldername(name))[2] = auth.uid()::text
);

-- catalog admin policies
-- Catalog admins can read all files in their tenant.
CREATE POLICY "catalog_admins_can_read_tenant"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'role') = 'catalog_admin'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
);


-- catalog admins can update files in their tenant.
CREATE POLICY "catalog_admins_can_update_tenant"
ON storage.objects
FOR UPDATE
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'role') = 'catalog_admin'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
)
WITH CHECK (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'role') = 'catalog_admin'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
);


-- catalog admins can delete files in their tenant.
CREATE POLICY "catalog_admins_can_delete_tenant"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'role') = 'catalog_admin'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'tenant_id')
);

-- super_admin policies
-- super_admins can upload anywhere in the bucket.
CREATE POLICY "super_admins_can_upload"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'role') = 'super_admin'
);


-- super_admins can read all files.
CREATE POLICY "super_admins_can_read_all"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'role') = 'super_admin'
);


-- super_admins can update all files.
CREATE POLICY "super_admins_can_update_all"
ON storage.objects
FOR UPDATE
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'role') = 'super_admin'
)
WITH CHECK (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'role') = 'super_admin'
);


-- super_admins can delete all files.
CREATE POLICY "super_admins_can_delete_all"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'catalog-uploads'
    AND (auth.jwt() ->> 'role') = 'super_admin'
);