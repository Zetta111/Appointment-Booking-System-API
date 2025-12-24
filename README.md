# Appointment-Booking-System-API
Transactional appointment booking API with database enforced concurrency guarantees


# Appointment Booking System API

## Overview
Backend API for a multi tenant appointment booking system designed to be **safe under concurrency**.  
The core goal is to guarantee **no double booking** and **exactly once booking** using database level invariants.

---

## Key Design Decisions
- **Database enforced scheduling correctness** using PostgreSQL `EXCLUDE` constraints (`GiST`, `tsrange`)
- **Transactional booking flow** to ensure atomic appointment creation
- **One-time, expiring booking tokens** with row level locking to prevent duplicate submissions
- **Strict tenant isolation** by scoping all operations to an organization

---

## Booking Flow (Atomic)
1. Start database transaction
2. Lock booking token (`SELECT … FOR UPDATE`)
3. Validate organization, barber, and service
4. Compute appointment end time server-side
5. Insert appointment (DB enforces no overlap)
6. Mark token as used
7. Commit transaction

Failures roll back the entire transaction.

---

## Concurrency & Safety Guarantees
- No overlapping appointments per barber
- Tokens can only be used once
- Safe under concurrent requests
- Correctness enforced at the database level

---

## Example Request
```bash
curl -X POST http://localhost:3000/public/test-shop/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "bookingToken": "test-token-123",
    "barberId": 1,
    "serviceId": 1,
    "startTime": "2025-03-12T14:00:00Z"
  }'
