INSERT INTO booking_tokens (organization_id, token,expired_at )
SELECT
    id,
    'test-token-123',
    now() + interval '30 minutes'
FROM organizations
WHERE name = 'test-shop'
ON CONFLICT DO NOTHING;



