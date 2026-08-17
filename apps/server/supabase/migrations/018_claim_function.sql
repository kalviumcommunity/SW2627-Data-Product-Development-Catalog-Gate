-- the workers would just call this function to claim a pending job and transition to processing

-- Needs the security definer to bypass public.users rls


CREATE OR REPLACE FUNCTION claim_next_catalog_upload()
RETURNS catalog_uploads
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    upload_record catalog_uploads;
BEGIN
    SELECT *
    INTO upload_record
    FROM catalog_uploads
    WHERE status = 'PENDING'
    ORDER BY created_at
    FOR UPDATE SKIP LOCKED
    LIMIT 1;

    IF upload_record.id IS NULL THEN
        RETURN NULL;
    END IF;

    UPDATE catalog_uploads
    SET
        status = 'PROCESSING',
        updated_at = now()
    WHERE id = upload_record.id
    RETURNING *
    INTO upload_record;

    RETURN upload_record;
END;
$$;