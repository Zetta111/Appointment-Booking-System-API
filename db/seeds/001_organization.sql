INSERT INTO organizations(name)
VALUES ('test-shop')
ON CONFLICT DO NOTHING;

