create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
    claims jsonb;
    user_role public.user_role;
begin
    select u.user_role
    into user_role
    from public.users u
    where u.id = (event->>'user_id')::uuid;

    claims := event->'claims';

    claims := jsonb_set(
        claims,
        '{user_role}',
        coalesce(to_jsonb(user_role), 'null'::jsonb)
    );

    return jsonb_set(event, '{claims}', claims);
end;
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