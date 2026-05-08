# 🍽 Food Surplus Sharing Backend

This is the backend for a Food Surplus Sharing App built using **Node.js, Express, and PostgreSQL**.

---

## 🚀 Features

* User Authentication (JWT)
* Role-based system:

  * Restaurant (Giver)
  * Individual (Receiver)
  * Food Bank (Receiver)
* Food Listings
* Reservations
* Pickup system (code-based confirmation)

---

## 🧱 Tech Stack

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication

---

## 📁 Project Structure

```
src/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── utils/
└── config/
```

---

## ⚙️ Setup Instructions

### 1. Clone repo

```
git clone <your-repo-url>
cd backend
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Create `.env` file

```
PORT=5000
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/foodapp
JWT_SECRET=your_secret_key
```

---

### 4. Run server

```
npm run dev
```

---

## 🧪 API Endpoints

### Auth

* POST `/auth/register`
* POST `/auth/login`

### Users

* GET `/users/me`

### Listings

* POST `/listings`
* GET `/listings`

### Reservations

* POST `/reservations`

### Pickup

* POST `/pickup/generate`
* POST `/pickup/confirm`

---

## ⚠️ Notes

* `.env` file is ignored for security
* Use Postman to test APIs
* JWT token required for protected routes

---

## 👨‍💻 Author

* Your Name
