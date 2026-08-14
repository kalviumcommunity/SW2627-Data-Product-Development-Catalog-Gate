CREATE TABLE reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id uuid NOT NULL REFERENCES users(id),
    tenant_id uuid NOT NULL REFERENCES tenants(id),
    catalog_upload_id uuid NOT NULL
        REFERENCES catalog_uploads(id)
        ON DELETE CASCADE,

    generated_at timestamptz NOT NULL DEFAULT now(),

    ext text NOT NULL,
    total_rules int NOT NULL,
    total_failed_rules int NOT NULL,

    blocked jsonb,
    warning jsonb,
    outliers jsonb,
    errors jsonb
);

-- vendor policies
-- vendors can view reports generated for their own uploads.
CREATE POLICY vendors_can_select_own_reports
ON reports
FOR SELECT
USING (
    auth.jwt()->>'role' = 'vendor'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
    AND user_id = auth.uid()
);

-- catalog admin policies
-- catalog admins can view reports belonging to their tenant.
CREATE POLICY catalog_admins_can_select_reports
ON reports
FOR SELECT
USING (
    auth.jwt()->>'role' = 'catalog_admin'
    AND auth.jwt()->>'tenant_id' = tenant_id::text
);

-- super admin policies
-- super admins can view all reports.
CREATE POLICY super_admins_can_select_reports
ON reports
FOR SELECT
USING (
    auth.jwt()->>'role' = 'super_admin'
);


ALTER TABLE reports ENABLE ROW LEVEL SECURITY;