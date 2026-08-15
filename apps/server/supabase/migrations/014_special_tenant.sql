-- Change tenant code to be case-insensitive
ALTER TABLE tenants
DROP CONSTRAINT tenants_code_key;

CREATE UNIQUE INDEX tenants_code_lower_unique
ON tenants (LOWER(code));

-- A super admin may create tenants, provided the new tenant isn't the reserved CatalogGate tenant.
-- CatalogGate tenant will only be created once by the startup script

DROP POLICY IF EXISTS super_admins_can_insert_tenants
ON tenants;


CREATE POLICY super_admins_can_insert_tenants
ON tenants
FOR INSERT
WITH CHECK (
    auth.jwt()->>'role' = 'super_admin'
    AND LOWER(code) <> 'cataloggate'
);