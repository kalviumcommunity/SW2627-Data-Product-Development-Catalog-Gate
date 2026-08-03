-- Seed data for the tenants and users tables and we ran this file via GUI not via migrations..


-- Insert a tenant
insert into tenants (name, code)
values (
    'bookslog',
    'BOOKSLOG'
);

-- Insert a user belonging to bookslog
insert into users (
    tenant_id,
    role,
    email,
    phone,
    name
)
values (
    (
        select id
        from tenants
        where code = 'BOOKSLOG'
    ),
    'catalog_admin',
    'admin@bookslog.com',
    '9876543210',
    'Bookslog Admin'
);