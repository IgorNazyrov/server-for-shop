ALTER TABLE products ALTER COLUMN dimensions TYPE jsonb USING dimensions::text::jsonb;
DROP TYPE IF EXISTS dimensions_type;

ALTER TABLE products ALTER COLUMN meta TYPE jsonb USING meta::text::jsonb;
DROP TYPE IF EXISTS meta_type;