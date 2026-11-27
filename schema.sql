create table tutors(id uuid primary key default gen_random_uuid(), token text unique default encode(gen_random_bytes(16),'hex'),
 name text not null, slug text unique not null, subjects text[] default '{}', classes text, mode text default 'both', location text,
 rate_per_hour int, bio text, verified bool default false, reg_paid bool default false, created_at timestamptz default now());
create table enquiries(id uuid primary key default gen_random_uuid(), tutor_id uuid references tutors on delete cascade,
 parent_name text, parent_email text, parent_phone text, student_class text, message text, status text default 'new', created_at timestamptz default now());
create table replies(id uuid primary key default gen_random_uuid(), enquiry_id uuid references enquiries on delete cascade,
 body text, status text default 'draft', sent_at timestamptz, created_at timestamptz default now());
create table materials(id uuid primary key default gen_random_uuid(), tutor_id uuid references tutors on delete cascade,
 enquiry_id uuid references enquiries on delete set null, type text, title text, content text, created_at timestamptz default now());
create table payments(id uuid primary key default gen_random_uuid(), tutor_id uuid references tutors on delete cascade,
 enquiry_id uuid references enquiries on delete set null, kind text, amount int, status text default 'pending', created_at timestamptz default now());
