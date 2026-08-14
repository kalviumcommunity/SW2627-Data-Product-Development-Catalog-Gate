-- vendor policies
-- vendors can view their own tenant.
CREATE POLICY vendors_can_select_own_tenant
ON tenants
FOR SELECT
USING (
    auth.jwt()->>'role' = 'vendor'
    AND auth.jwt()->>'tenant_id' = id::text
);

-- catalog admin policies
-- catalog admins can view their own tenant.
CREATE POLICY catalog_admins_can_select_own_tenant
ON tenants
FOR SELECT
USING (
    auth.jwt()->>'role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = id::text
);

-- super admin policies
-- super admins can view all tenants.
CREATE POLICY super_admins_can_select_tenants
ON tenants
FOR SELECT
USING (
    auth.jwt()->>'role' = 'super_admin'
);


-- super admins can create tenants.
CREATE POLICY super_admins_can_insert_tenants
ON tenants
FOR INSERT
WITH CHECK (
    auth.jwt()->>'role' = 'super_admin'
);


-- super admins can update tenants.
CREATE POLICY super_admins_can_update_tenants
ON tenants
FOR UPDATE
USING (
    auth.jwt()->>'role' = 'super_admin'
)
WITH CHECK (
    auth.jwt()->>'role' = 'super_admin'
);


-- super admins can delete tenants.
CREATE POLICY super_admins_can_delete_tenants
ON tenants
FOR DELETE
USING (
    auth.jwt()->>'role' = 'super_admin'
);


-- enable rls
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;