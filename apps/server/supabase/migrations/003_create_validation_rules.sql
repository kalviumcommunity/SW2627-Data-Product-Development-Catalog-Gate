create type validation_severity as enum (
    'INFO',
    'WARNING',
    'BLOCK'
);

create table validation_rules (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    description text not null,
    severity validation_severity not null
);