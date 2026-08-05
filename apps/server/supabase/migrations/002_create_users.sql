create type user_role as enum(
    'vendor',
    'catalog_admin',
    'super_admin'
);

create table users(
    id uuid primary key default gen_random_uuid(),

    tenant_id uuid not null references tenants(id),

    role user_role not null,

    email text unique not null,

    phone text,

    name text not null
);