INSERT INTO users(organization_id, email,password_hash,role)
SELECT id, 'barber@test.com', 'fakehash','barber'
FROM organizations
WHERE name = 'test-shop'
ON CONFLICT DO NOTHING;

INSERT INTO barbers( organization_id, user_id)
SELECT u.organization_id, u.id
FROM users u
JOIN organizations o ON o.id=u.organization_id
WHERE u.email = 'barber@test.com'
ON CONFLICT DO NOTHING;

