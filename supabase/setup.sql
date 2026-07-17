-- Compass Study — Supabase cache table setup
-- Run this ONCE in the Supabase SQL Editor (Project → SQL Editor → New query → paste → Run).

-- Generic single-key cache (lessons, explanations, translations).
create table if not exists content_cache (
  cache_key text primary key,
  content_type text not null,
  content jsonb not null,
  language text not null,
  created_at timestamptz not null default now()
);

create index if not exists content_cache_type_idx on content_cache (content_type);

-- Quiz question bank — moved here from Firestore's questionBank collection
-- because it was the single biggest contributor to Firestore's 1GB quota
-- (one row per generated question). Structured as real columns, not an
-- opaque cache key, because generate-quiz.ts queries it by
-- subject + grade + subUnit to mix in variety across attempts.
create table if not exists question_bank (
  id bigint generated always as identity primary key,
  question text not null,
  options jsonb not null,
  answer_index int not null,
  explanation text not null,
  subject text not null,
  grade text not null,
  unit text,
  sub_unit text not null,
  language text not null,
  created_at timestamptz not null default now()
);

create index if not exists question_bank_lookup_idx
  on question_bank (subject, grade, sub_unit);

alter table content_cache enable row level security;
alter table question_bank enable row level security;

-- No policies are created here on purpose — with RLS enabled and zero
-- policies, the table is fully inaccessible to anyone except server-side
-- code using the secret key, which bypasses RLS entirely. This is the
-- correct locked-down state, not an oversight.
