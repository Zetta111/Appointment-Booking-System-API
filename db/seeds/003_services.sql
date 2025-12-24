INSERT INTO services( organization_id, name , duration_minutes, price_cents)
SELECT id,'Haircut', 30, 3000
FROM organizations
WHERE name ='test-shop'
ON CONFLICT DO NOTHING;