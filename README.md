# Event Booking System

> A REST API backend built with Node.js, Express, and MongoDB. Supports two user roles — **Organizers** and **Customers**. All authenticated users can browse events. Organizers can create and manage their own events. Customers can book tickets.

---

## Tech Stack
Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

---

## API Endpoints

### Auth
```
POST /api/v1/auth/register        → register as ORGANIZER or CUSTOMER
POST /api/v1/auth/login           → login, receive JWT
POST /api/v1/auth/logout          → logout
POST /api/v1/auth/change-password → change password (auth required)
```

### Events
```
GET  /api/v1/events?page=1&limit=10  → get all events (paginated)
GET  /api/v1/events/:id              → get single event
POST /api/v1/events/create-event     → create event (organizer only)
PUT  /api/v1/events/:id              → update event (organizer only)
POST /api/v1/events/:id/book         → book tickets (customer only)
```

---

## Design Decisions

**Role-Based Access Control**
Two middleware layers on every protected route - `verifyJWT` validates the token and attaches the user, `requireRole` checks the role. Role enums are ALL CAPS (ORGANIZER, CUSTOMER) for consistency between schema and middleware.

**Atomic Ticket Booking**
Used `findOneAndUpdate` with `$inc` and a `$gte` filter to check availability and decrement tickets in a single atomic MongoDB operation. Prevents race conditions and overselling when multiple customers book simultaneously.

**Background Tasks**
Used `setTimeout(async () => {}, 0)` to defer non-critical work to the next event loop iteration. The API response is sent immediately; background logging happens after.
- Task 1: Booking confirmation logged after successful booking
- Task 2: Queries all bookings for the updated event and logs a notification per customer

**JWT Design**
Payload contains `_id` and `role` only — lightweight, no extra DB call needed to check permissions on each request. Token stored in httpOnly cookie (secure in production) and also returned in response body for API clients.

**Password Security**
Passwords hashed with bcrypt via pre-save hook. `select: false` on password field ensures it never leaks into responses. Only explicitly fetched with `.select("+password")` when needed.

**Pagination**
`GET /events` accepts `page` and `limit` query params. Returns `events`, `totalEvents`, `totalPages` so the frontend can build pagination UI without extra requests.

**Performance**
Added a MongoDB index on `Booking.event` to speed up the notification query that finds all customers booked for a specific event.

---

## Running Locally

```bash
npm install
npm run dev
```

### Environment Variables
```
PORT=3000
MONGODB_URI=mongodb_uri
JWT_SECRET=secretkey
CORS_ORIGIN=*
NODE_ENV=development
```