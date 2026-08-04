--  Remove generated UUID default
alter table users
    alter column id drop default;


--  Change id reference to Supabase auth.users
alter table users
    drop constraint users_pkey,
    add primary key (id);


alter table users
    add constraint users_id_fkey
    foreign key (id)
    references auth.users(id)
    on delete cascade;


--  Add created_at column
alter table users
    add column created_at timestamptz default now();


--  Update tenant_id foreign key to cascade delete
alter table users
    drop constraint users_tenant_id_fkey;


alter table users
    add constraint users_tenant_id_fkey
    foreign key (tenant_id)
    references tenants(id)
    on delete cascade;