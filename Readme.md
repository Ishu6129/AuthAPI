# 🔐 AuthAPI

**A secure, scalable, and production-ready authentication system built with Node.js and Express.**

AuthAPI provides a complete authentication workflow including JWT-based authentication, refresh token rotation, OTP email verification, session tracking, Redis-backed rate limiting, request validation, and background job processing using Redis + BullMQ.


## 🚀 Features

### 🔑 Authentication

* User Registration & Login
* JWT-based Authentication (Access + Refresh Tokens)
* Refresh Token Rotation
* Secure Logout (single session & all sessions)

### 📧 Email & OTP

* OTP-based Email Verification
* Resend OTP support
* Password Reset via OTP
* Login Alert Emails

### 🧠 Session Management

* Per-device session tracking (IP + User-Agent)
* Refresh tokens stored securely (hashed)
* Session revocation support

### ⚙️ Background Processing

* Email queue using BullMQ
* Redis-backed job processing
* Worker runs in same process (can be separated in production)

### 🛡️ Security

* Password hashing using bcrypt
* HTTP-only secure cookies
* Token expiration handling
* Centralized error handling middleware
* Input validation using Joi
* Redis-based rate limiting (global + route-specific)
* OTP expiration (10 min)
* Max OTP attempts (5)
* Login alert emails


## 🚦 Rate Limiting

To prevent abuse, brute-force attacks, and spam, the API uses Redis-backed rate limiting with fine-grained control per route.

### 🔹 Global Limiter

* Applied to all routes
* **100 requests per minute per IP**

### 🔹 Auth Limiter

* Applied to sensitive auth routes (register, refresh, forgot password, etc.)
* **20 requests per 15 minutes per IP + email**

### 🔹 Login Limiter (Strict)

* Applied only to login route
* **5 attempts per 15 minutes per IP + email**
* Protects against brute-force attacks

### 🔹 OTP Limiter

* Applied to OTP-related routes
* **10 requests per 10 minutes per IP + email + endpoint**
* Prevents OTP spamming

### 🔹 Storage

* All rate limits are stored in **Redis**
* Ensures scalability across multiple instances


## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT (jsonwebtoken)
* bcryptjs
* Redis
* BullMQ
* Nodemailer (OAuth2)
* Joi (Validation)


## 📁 Project Structure

```bash
AuthAPI/
│── src/
│   │── config/          # DB & environment configs
│   │── controllers/     # Business logic (auth flow)
│   │── middleware/      # Auth + validation + rate limiting
│   │── models/          # Mongoose schemas
│   │── queues/          # BullMQ queues & workers
│   │── routes/          # API routes
│   │── services/        # Email service
│   │── utils/           # Helpers (OTP, asyncHandler)
│   │── validators/      # Joi schemas
│   │── app.js           # Express app
│
│── server.js            # Entry point
│── .env
│── package.json
│── README.md
```


## ⚙️ Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URL=your_mongodb_connection
JWT_SECRET=your_secret_key

# Email (Gmail OAuth2)
EMAIL_USER=your_email
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REFRESH_TOKEN=your_refresh_token

# Redis
REDIS_URL=your_redis_url
```

## ▶️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/Ishu6129/AuthAPI.git

# Move into project
cd AuthAPI

# Install dependencies
npm install

# Run dev server
npm run dev
```


## 🔗 API Endpoints

### 🧑‍💻 Authentication

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/api/auth/register`   | Register user                |
| POST   | `/api/auth/login`      | Login user                   |
| GET    | `/api/auth/get-me`     | Get current user (protected) |
| POST   | `/api/auth/refresh`    | Refresh access token         |
| POST   | `/api/auth/logout`     | Logout current session       |
| POST   | `/api/auth/logout-all` | Logout all sessions          |


### 📧 Email & OTP

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| POST   | `/api/auth/verify-email`    | Verify email using OTP   |
| POST   | `/api/auth/new-otp`         | Request new OTP          |
| POST   | `/api/auth/forgot-password` | Send reset OTP           |
| POST   | `/api/auth/reset-password`  | Reset password using OTP |


## 🔐 Authentication Flow

1. User registers → OTP sent via email queue
2. User verifies email
3. User logs in → receives:

   * Access Token (15 min)
   * Refresh Token (7 days, stored in cookie)
4. Session created with:

   * IP address
   * User-Agent
5. Refresh token rotates on every refresh request
6. Logout revokes session(s)


## ⚠️ Error Handling

Centralized error handling via middleware:

* MongoDB duplicate key → `409 Conflict`
* Validation errors → `400 Bad Request`
* JWT errors → `401 Unauthorized`
* Default → `500 Internal Server Error`

Handled automatically using `asyncHandler`.


## 🧾 Request Validation

All incoming requests are validated using Joi schemas via a reusable middleware:

```bash
validate("register")
validate("login")
validate("email")
validate("resetPassword")
```

### Features:

* Prevents invalid data from reaching controllers
* Returns all validation errors (`abortEarly: false`)
* Removes unwanted fields (`stripUnknown: true`)
* Ensures clean and secure request payloads


## ⚡ Background Jobs (BullMQ)

* Email sending is offloaded to Redis queue
* Worker processes jobs asynchronously
* Improves performance & scalability

Worker currently runs in the same process (can be separated in production).


## 🧠 Key Concepts

### ✅ asyncHandler

* Wraps async controllers
* Automatically forwards errors to global handler

### ✅ errorHandler

* Global middleware
* Handles all errors (Mongo, JWT, validation, etc.)

### ✅ validate

* Middleware for request validation
* Uses Joi schemas
* Cleans and validates request body

### ✅ Session Model

* Tracks device-based login
* Stores hashed refresh tokens
* Enables secure logout & session control

---

## 🧪 Scripts

```bash
npm run dev     # Development (nodemon)
```


## 📄 License

MIT License


## 💡 Author

**Ishu Agrawal**
GitHub: https://github.com/Ishu6129
