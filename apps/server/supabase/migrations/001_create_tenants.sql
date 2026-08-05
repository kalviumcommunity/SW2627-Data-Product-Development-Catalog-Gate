create table tenants (
    id uuid primary key default gen_random_uuid(),

    name text not null,

    code text not null unique
);