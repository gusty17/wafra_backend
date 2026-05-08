# 🍽 Food Surplus Sharing Backend

Backend API for the **Food Surplus Sharing App (Wafra)** built using **Node.js, Express, PostgreSQL, and JWT Cookie Authentication**.

The system connects restaurants that have surplus food with individuals and food banks who can reserve and collect it.

---

## 🚀 Features

- User registration and login
- Cookie-based JWT authentication
- Role-based access control
- Three user roles:
  - Restaurant
  - Individual
  - Food Bank
- Restaurant and Food Bank approval flow
- Food listing management
- Food reservation system
- Restaurant request approval/decline
- Pickup code and QR-data generation
- Pickup confirmation
- PostgreSQL database schema

---

## 🧱 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT
- Cookie Parser
- bcryptjs
- Docker PostgreSQL

---

## 📁 Project Structure

```bash
backend/
├── server.js
├── package.json
├── .gitignore
├── README.md
└── src/
    ├── app.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── admin.controller.js
    │   ├── auth.controller.js
    │   ├── listing.controller.js
    │   ├── pickup.controller.js
    │   ├── reservation.controller.js
    │   └── user.controller.js
    ├── database/
    │   └── schema.sql
    ├── middlewares/
    │   └── auth.middleware.js
    ├── models/
    │   ├── foodBank.model.js
    │   ├── individual.model.js
    │   ├── listing.model.js
    │   ├── pickup.model.js
    │   ├── reservation.model.js
    │   ├── restaurant.model.js
    │   └── user.model.js
    ├── routes/
    │   ├── admin.routes.js
    │   ├── auth.routes.js
    │   ├── listing.routes.js
    │   ├── pickup.routes.js
    │   ├── reservation.routes.js
    │   └── user.routes.js
    ├── services/
    └── utils/
```

---

## ⚙️ Setup Instructions

### 1. Install dependencies

```bash
cd backend
npm install
```

---

### 2. Create `.env` file

Create a `.env` file inside the `backend` folder.

Use this structure:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/wafra_db
JWT_SECRET=YOUR_JWT_SECRET
```

Example values should only be used locally. Do not push the `.env` file to GitHub.

---

### 3. Run PostgreSQL using Docker

```bash
docker run --name wafra-postgres -e POSTGRES_PASSWORD=YOUR_PASSWORD -e POSTGRES_DB=wafra_db -p 5432:5432 -d postgres
```

If the container already exists, start it using:

```bash
docker start wafra-postgres
```

---

### 4. Run database schema

From the `backend` folder:

```bash
docker cp src/database/schema.sql wafra-postgres:/schema.sql
docker exec -it wafra-postgres psql -U postgres -d wafra_db -f /schema.sql
```

To check tables:

```bash
docker exec -it wafra-postgres psql -U postgres -d wafra_db
```

Then inside PostgreSQL:

```sql
\dt
```

Expected tables:

```text
users
restaurants
food_banks
individuals
food_listings
reservations
pickups
notifications
```

---

### 5. Run backend server

```bash
npm run dev
```

Expected output:

```text
Server running on port 5000
DB Connected ✅
```

---

## 🔐 Authentication

The backend uses **JWT stored in cookies**.

After login, the token is saved automatically in a cookie named:

```text
token
```

Protected routes read the token from the cookie.

For Postman testing, login first before calling protected routes.

---

## 👥 User Roles

### 1. Individual

Individuals are receivers.

They can:

- Register and login
- Browse listings
- Reserve food
- Generate pickup code after reservation is accepted

Individuals are approved automatically.

```text
verification_status = approved
```

---

### 2. Restaurant

Restaurants are givers.

They can:

- Register and login
- Create food listings
- View their own listings
- View reservation requests
- Accept or decline reservations
- Confirm pickup using code

Restaurants must be approved before posting food.

```text
verification_status = pending
```

---

### 3. Food Bank

Food banks are receivers, like individuals, but represent organizations.

They can:

- Register and login
- Browse listings
- Reserve larger quantities
- Generate pickup code after reservation is accepted

Food banks must be approved before reserving food.

```text
verification_status = pending
```

---

# 🧪 API Endpoints

Base URL:

```text
http://localhost:5000
```

---

## Auth Endpoints

### Register User

```http
POST /auth/register
```

---

### Register Individual

```json
{
  "name": "Youssef",
  "email": "youssef@test.com",
  "phone": "01000000000",
  "password": "123456",
  "role": "individual"
}
```

---

### Register Restaurant

```json
{
  "name": "Restaurant Owner",
  "email": "restaurant@test.com",
  "phone": "01000000001",
  "password": "123456",
  "role": "restaurant",
  "restaurant_name": "Pizza House",
  "cuisine_type": "Italian",
  "license_number": "LIC123",
  "location": "Cairo"
}
```

---

### Register Food Bank

```json
{
  "name": "Food Bank Manager",
  "email": "foodbank@test.com",
  "phone": "01000000002",
  "password": "123456",
  "role": "foodbank",
  "organization_name": "Hope Food Bank",
  "registration_number": "REG123",
  "location": "Giza"
}
```

---

### Login

```http
POST /auth/login
```

```json
{
  "email": "youssef@test.com",
  "password": "123456"
}
```

After successful login, the JWT token is stored in cookies.

---

### Logout

```http
POST /auth/logout
```

Clears the authentication cookie.

---

## User Endpoints

### Get Current User Profile

```http
GET /users/me
```

Requires login.

Example response:

```json
{
  "user": {
    "user_id": 1,
    "name": "Youssef",
    "email": "youssef@test.com",
    "phone": "01000000000",
    "role": "individual",
    "verification_status": "approved"
  },
  "profile": {
    "individual_id": 1,
    "user_id": 1
  }
}
```

---

## Admin Endpoints

Used to approve or reject restaurants and food banks.

### Approve User

```http
PATCH /admin/users/:id/approve
```

Example:

```http
PATCH /admin/users/2/approve
```

---

### Reject User

```http
PATCH /admin/users/:id/reject
```

Example:

```http
PATCH /admin/users/2/reject
```

---

## Listing Endpoints

### Get All Available Listings

```http
GET /listings
```

Requires login.

Optional query parameters:

```http
GET /listings?search=pizza
GET /listings?category=Fast Food
GET /listings?status=available
```

---

### Get Listing by ID

```http
GET /listings/:id
```

Example:

```http
GET /listings/1
```

---

### Get My Restaurant Listings

```http
GET /listings/my
```

Requires:

```text
role = restaurant
verification_status = approved
```

---

### Create Food Listing

```http
POST /listings
```

Requires:

```text
role = restaurant
verification_status = approved
```

Request body:

```json
{
  "food_name": "Pizza Slices",
  "category": "Fast Food",
  "quantity": 10,
  "pickup_time": "2026-05-09T18:00:00",
  "location": "Cairo",
  "photo_url": "https://example.com/pizza.jpg",
  "dietary_tags": "halal, vegetarian"
}
```

---

### Update Listing

```http
PUT /listings/:id
```

Requires restaurant owner of the listing.

Example:

```http
PUT /listings/1
```

---

### Delete Listing

```http
DELETE /listings/:id
```

Requires restaurant owner of the listing.

Example:

```http
DELETE /listings/1
```

---

## Reservation Endpoints

### Create Reservation

```http
POST /reservations
```

Requires:

```text
role = individual OR foodbank
verification_status = approved
```

Request body:

```json
{
  "listing_id": 1,
  "requested_quantity": 2
}
```

Reservation status starts as:

```text
pending
```

---

### Get My Reservations

```http
GET /reservations/my
```

Requires login.

Returns reservations made by the current individual or food bank.

---

### Get Restaurant Reservation Requests

```http
GET /reservations/restaurant
```

Requires:

```text
role = restaurant
verification_status = approved
```

Returns reservations made on the restaurant’s listings.

---

### Accept Reservation

```http
PATCH /reservations/:id/accept
```

Requires:

```text
role = restaurant
verification_status = approved
```

Example:

```http
PATCH /reservations/1/accept
```

Reservation status becomes:

```text
accepted
```

---

### Decline Reservation

```http
PATCH /reservations/:id/decline
```

Requires:

```text
role = restaurant
verification_status = approved
```

Example:

```http
PATCH /reservations/1/decline
```

Reservation status becomes:

```text
declined
```

---

### Cancel Reservation

```http
PATCH /reservations/:id/cancel
```

Requires:

```text
role = individual OR foodbank
verification_status = approved
```

Example:

```http
PATCH /reservations/1/cancel
```

Reservation status becomes:

```text
cancelled
```

---

## Pickup Endpoints

### Generate Pickup Code

```http
POST /pickups/generate
```

Requires:

```text
role = individual OR foodbank
verification_status = approved
reservation_status = accepted
```

Request body:

```json
{
  "reservation_id": 1
}
```

Example response:

```json
{
  "pickup": {
    "code": "1234",
    "qr_code": "{\"reservation_id\":1,\"code\":\"1234\"}",
    "status": "active"
  }
}
```

---

### Confirm Pickup

```http
POST /pickups/confirm
```

Requires:

```text
role = restaurant
verification_status = approved
```

Request body:

```json
{
  "code": "1234"
}
```

After successful confirmation:

```text
pickup status = used
reservation status = completed
```

---

# 🔄 Complete System Flow

## Restaurant Flow

```text
1. Restaurant registers.
2. Restaurant status becomes pending.
3. Admin approves restaurant.
4. Restaurant logs in.
5. Restaurant creates food listing.
6. Restaurant views incoming reservation requests.
7. Restaurant accepts or declines requests.
8. Restaurant confirms pickup using pickup code.
```

---

## Individual Flow

```text
1. Individual registers.
2. Individual status becomes approved automatically.
3. Individual logs in.
4. Individual browses listings.
5. Individual reserves food.
6. Reservation status becomes pending.
7. Restaurant accepts reservation.
8. Individual generates pickup code.
9. Restaurant confirms pickup.
10. Reservation becomes completed.
```

---

## Food Bank Flow

```text
1. Food bank registers.
2. Food bank status becomes pending.
3. Admin approves food bank.
4. Food bank logs in.
5. Food bank browses listings.
6. Food bank reserves food.
7. Restaurant accepts reservation.
8. Food bank generates pickup code.
9. Restaurant confirms pickup.
10. Reservation becomes completed.
```

---

# ✅ Tested Backend Workflow

The following flows have been tested successfully:

```text
Individual registration
Restaurant registration
Food Bank registration
Cookie-based login
Profile retrieval
Admin approval
Restaurant listing creation
Individual reservation
Food Bank reservation
Restaurant accepting reservation
Pickup code generation
Pickup confirmation
Reservation completion
```

---

# ⚠️ Notes

- `.env` is ignored for security.
- `node_modules` is ignored.
- Use Postman to test all endpoints.
- Login first before testing protected routes.
- Cookies are used for authentication.
- Restaurants and food banks must be approved before using their main features.
- Individuals are approved automatically.
- Replace placeholder values such as `YOUR_PASSWORD` and `YOUR_JWT_SECRET` with local values only.
- Do not push real database credentials or JWT secrets to GitHub.

---

## 👨‍💻 Author

Food Surplus Sharing Backend Team