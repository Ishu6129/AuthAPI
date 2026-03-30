# 🔐 AuthAPI

**A secure and scalable authentication API for modern applications.**

AuthAPI is a production-ready authentication system built with Node.js and Express. It provides a complete authentication flow including JWT-based authentication, refresh tokens, OTP email verification, session management, and background job processing using Redis and BullMQ.


## 🚀 Features

* 🔑 User Registration & Login
* 🔐 Password Hashing with bcrypt
* 📧 OTP-based Email Verification
* 🔁 JWT Authentication (Access + Refresh Tokens)
* 🧠 Session Management (stored in database)
* 🚪 Logout (single device & all devices)
* ⚠️ Login Alert Emails
* 📬 Background Email Queue (BullMQ + Redis)
* ⏳ Token Expiry & Rotation
* 🛡️ Secure HTTP-only Cookie Handling

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JSON Web Tokens
* bcryptjs
* Redis
* BullMQ


## 📁 Project Structure
```
AuthAPI/
│── src/
│   │── config/          # Environment & DB configuration
│   │── controllers/     # Request handlers
│   │── middleware/      # Auth middlewares
│   │── models/          # Mongoose models
│   │── queues/          # Background jobs (BullMQ)
│   │── routes/          # API routes
│   │── services/        # Business logic (email, etc.)
│   │── utils/           # Helper functions
│   │── app.js           # Express app setup
│
│── server.js            # Server entry point
│── .env
│── .gitignore
│── package.json
│── README.md
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:
```
PORT=5000
MONGO_URL=your_mongodb_connection
JWT_SECRET=your_secret_key

# Email (OAuth2 / Gmail)

EMAIL_USER=your_email
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REFRESH_TOKEN=your_refresh_token

# Redis

REDIS_URL=your_redis_url
```

## ▶️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Ishu6129/AuthAPI.git

# Navigate into the project
cd AuthAPI

# Install dependencies
npm install

# Run in development
npm run dev
```

## 🔗 API Endpoints

### 🧑‍💻 Auth Routes

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/api/auth/register`   | Register a new user          |
| POST   | `/api/auth/login`      | Login user                   |
| GET    | `/api/auth/get-me`     | Get current user (protected) |
| POST   | `/api/auth/refresh`    | Refresh access token         |
| POST   | `/api/auth/logout`     | Logout (current session)     |
| POST   | `/api/auth/logout-all` | Logout from all devices      |


### 📧 OTP & Email Verification

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| POST   | `/api/auth/verify-email` | Verify email with OTP |
| POST   | `/api/auth/new-otp`      | Request a new OTP     |


## 🔐 Authentication Flow

1. User registers → OTP sent to email
2. User verifies email using OTP
3. User logs in → receives:

   * Access Token (short-lived)
   * Refresh Token (stored in HTTP-only cookie)
4. Refresh token is used to generate new access tokens
5. Sessions are securely stored and managed


## 🧠 Security Features

* Password hashing using bcrypt
* Hashed refresh tokens stored in database
* OTP expiration & retry limits
* Secure HTTP-only cookies
* Session revocation support
* Login alert notifications


## 🧪 Scripts

```bash
npm run dev     # Run with nodemon
```


## 📄 License

This project is licensed under the MIT License.

## 💡 Author

**Ishu**
GitHub: [https://github.com/Ishu6129](https://github.com/Ishu6129)
