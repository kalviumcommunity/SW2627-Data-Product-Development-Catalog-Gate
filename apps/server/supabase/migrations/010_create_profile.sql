CREATE TABLE dataset_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    report_id uuid NOT NULL
        REFERENCES reports(id)
        ON DELETE CASCADE,

    tenant_id uuid NOT NULL REFERENCES tenants(id),

    row_count int NOT NULL,
    column_count int NOT NULL,

    duplicate_count int NOT NULL,
    duplicate_percentage float NOT NULL,

    valid_count int NOT NULL,
    invalid_count int NOT NULL,

    numerical_profile jsonb NOT NULL,
    columns jsonb NOT NULL
);


-- vendor policies
-- vendors can view profiles belonging to their own reports.
CREATE POLICY vendors_can_select_own_dataset_profiles
ON dataset_profiles
FOR SELECT
USING (
    auth.jwt()->>'role' = 'vendor'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
    AND EXISTS (
        SELECT 1
        FROM reports
        WHERE reports.id = dataset_profiles.report_id
          AND reports.user_id = auth.uid()
    )
);

-- catalog admin policies
-- catalog admins can view profiles in their tenant.
CREATE POLICY catalog_admins_can_select_dataset_profiles
ON dataset_profiles
FOR SELECT
USING (
    auth.jwt()->>'role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);


-- super admin policies
-- super admins can view all profiles.
CREATE POLICY super_admins_can_select_dataset_profiles
ON dataset_profiles
FOR SELECT
USING (
    auth.jwt()->>'role' = 'super_admin'
);


-- enable rls
ALTER TABLE dataset_profiles ENABLE ROW LEVEL SECURITY;