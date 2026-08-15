-- Needs the security definer to bypass public.users rls
-- also, was unable to find a way to enable this via non-UI way (config.toml apparently works solely for local setting)
-- for now need to enable it manually via Supabase UI: authentication > auth hooks > add hook

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    claims jsonb;
    user_role public.user_role;
    tenant_id uuid;
BEGIN
    SELECT
        u.user_role,
        u.tenant_id
    INTO
        user_role,
        tenant_id
    FROM public.users u
    WHERE u.id = (event->>'user_id')::uuid;

    claims := event->'claims';

    claims := jsonb_set(
        claims,
        '{user_role}',
        COALESCE(to_jsonb(user_role), 'null'::jsonb)
    );

    claims := jsonb_set(
        claims,
        '{tenant_id}',
        COALESCE(to_jsonb(tenant_id), 'null'::jsonb)
    );

    RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

grant usage on schema public to supabase_auth_admin;

grant execute
on function public.custom_access_token_hook
to supabase_auth_admin;

grant select
on table public.users
to supabase_auth_admin;

revoke execute
on function public.custom_access_token_hook
from authenticated, anon, public;