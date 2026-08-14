-- vendor policies
-- vendors can view their own user record.
CREATE POLICY vendors_can_select_own_user
ON users
FOR SELECT
USING (
    auth.jwt()->>'role' = 'vendor'
    AND auth.uid() = id
);


-- vendors can update their own profile.
-- IMPORTANT: WITH CHECK prevents them from changing their
-- tenant_id or role to something they shouldn't have.
CREATE POLICY vendors_can_update_own_user
ON users
FOR UPDATE
USING (
    auth.jwt()->>'role' = 'vendor'
    AND auth.uid() = id
)
WITH CHECK (
    auth.jwt()->>'role' = 'vendor'
    AND auth.uid() = id
    AND tenant_id = (
        SELECT u.tenant_id
        FROM users u
        WHERE u.id = auth.uid()
    )
    AND role = 'vendor'
);

-- catalog admin policies
-- catalog admins can view users in their tenant.
CREATE POLICY catalog_admins_can_select_tenant_users
ON users
FOR SELECT
USING (
    auth.jwt()->>'role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);


-- catalog admins can update users in their tenant.
CREATE POLICY catalog_admins_can_update_tenant_users
ON users
FOR UPDATE
USING (
    auth.jwt()->>'role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
)
WITH CHECK (
    auth.jwt()->>'role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);

-- super admin policies
-- super admins can view all users.
CREATE POLICY super_admins_can_select_users
ON users
FOR SELECT
USING (
    auth.jwt()->>'role' = 'super_admin'
);

-- super admins can create users.
CREATE POLICY super_admins_can_insert_users
ON users
FOR INSERT
WITH CHECK (
    auth.jwt()->>'role' = 'super_admin'
);

-- super admins can update users.
CREATE POLICY super_admins_can_update_users
ON users
FOR UPDATE
USING (
    auth.jwt()->>'role' = 'super_admin'
)
WITH CHECK (
    auth.jwt()->>'role' = 'super_admin'
);


-- super admins can delete users.
CREATE POLICY super_admins_can_delete_users
ON users
FOR DELETE
USING (
    auth.jwt()->>'role' = 'super_admin'
);

-- enable rls
ALTER TABLE users ENABLE ROW LEVEL SECURITY;