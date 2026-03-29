# 🔐 AuthAPI

**A simple and secure authentication API for modern applications.**

AuthAPI is a production-ready authentication system built with Node.js and Express. It provides a complete authentication flow including JWT-based authentication, refresh tokens, OTP email verification, session management, and background job processing using Redis and BullMQ.


## 🚀 Features

* 🔑 User Registration & Login
* 🔐 Password Hashing with bcrypt
* 📧 OTP-based Email Verification
* 🔁 JWT Authentication (Access + Refresh Tokens)
* 🧠 Session Management with database storage
* 🚪 Logout from single or all devices
* ⚠️ Login Alert Emails
* 📬 Background Email Queue (BullMQ + Redis)
* ⏳ Token Expiry & Rotation
* 🛡️ Secure Cookie Handling


## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT (jsonwebtoken)
* bcryptjs
* Redis
* BullMQ

## 📁 Project Structure

```
AuthAPI/
│── controllers/
│── models/
│── routes/
│── services/
│── utils/
│── queues/
│── config/
│── app.js
│── server.js
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
REDIS_URL=your_redis_url
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```
## ▶️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Ishu6129/AuthAPI.git

# Go into the project folder
cd AuthAPI

# Install dependencies
npm install

# Run the server
npm run dev
```

## 🔗 API Endpoints

### 🧑‍💻 Auth Routes

| Method | Endpoint               | Description             |
| ------ | ---------------------- | ----------------------- |
| POST   | `/api/auth/register`   | Register user           |
| POST   | `/api/auth/login`      | Login user              |
| GET    | `/api/auth/me`         | Get current user        |
| POST   | `/api/auth/refresh`    | Refresh access token    |
| POST   | `/api/auth/logout`     | Logout                  |
| POST   | `/api/auth/logout-all` | Logout from all devices |


### 📧 OTP & Verification

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| POST   | `/api/auth/verify-email` | Verify email with OTP |
| POST   | `/api/auth/resend-otp`   | Request new OTP       |


## 🔐 Authentication Flow

1. User registers → OTP sent to email
2. User verifies email using OTP
3. User logs in → receives:

   * Access Token (short-lived)
   * Refresh Token (stored in cookie)
4. Refresh token used to generate new access tokens
5. Sessions stored and managed securely


## 🧠 Security Features

* Hashed passwords using bcrypt
* Hashed refresh tokens in DB
* OTP expiration & attempt limits
* HTTP-only secure cookies
* Session revocation support
* Login alert notifications

## 📄 License

This project is licensed under the MIT License.

## 💡 Author

**Ishu**
GitHub: https://github.com/Ishu6129
