CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS license_keys (
  key TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  mobile TEXT,
  user_id INTEGER REFERENCES users(id),
  linkedin_id TEXT,
  bound_at TIMESTAMPTZ,
  resume_generated_at TIMESTAMPTZ,
  razorpay_payment_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_log (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL REFERENCES license_keys(key),
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS generated_content (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL REFERENCES license_keys(key),
  endpoint TEXT NOT NULL,
  output_json JSONB,
  output_blob BYTEA,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS support_messages (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  key TEXT REFERENCES license_keys(key),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  admin_reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  replied_at TIMESTAMPTZ
);
