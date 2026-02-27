# ⌚ Watch Auction — Real-Time Bidding Platform

A full-stack real-time auction platform for luxury watches, built with **React**, **Node.js**, **MongoDB**, and **Socket.io**. Users can list watches for auction, place live bids that update instantly across all connected tabs, and authenticate securely with JWT.

---

## ✨ Features

- 🔴 **Live Bidding** — Socket.io rooms broadcast bid updates instantly to all viewers
- 🔐 **JWT Authentication** — Secure signup/login with bcrypt password hashing
- 📦 **MongoDB Persistence** — Watches and bids saved with full bid history
- ⏱️ **Auction Countdown** — Each watch has an expiry time; bidding is disabled after it ends
- 📧 **Email Notifications** — Nodemailer integration for transactional emails
- 🛡️ **Code Quality Gate** — ESLint + Prettier enforced on every commit via Husky + lint-staged

---

## 🛠️ Tech Stack

### Frontend

| Tech             | Purpose                  |
| ---------------- | ------------------------ |
| React 18         | UI framework             |
| React Router v6  | Client-side routing      |
| Socket.io-client | Real-time bid updates    |
| Axios            | HTTP requests            |
| Context API      | Global auth + cart state |
| Plain CSS        | Styling                  |

### Backend

| Tech               | Purpose                  |
| ------------------ | ------------------------ |
| Node.js + Express  | REST API server          |
| Socket.io          | WebSocket bidding events |
| MongoDB + Mongoose | Database + ODM           |
| JWT + bcryptjs     | Authentication           |
| Nodemailer         | Email service            |
| Multer             | File upload handling     |
| Nodemon            | Dev auto-restart         |

### DevOps / Quality

| Tool        | Purpose                          |
| ----------- | -------------------------------- |
| ESLint      | Code linting                     |
| Prettier    | Code formatting                  |
| Husky       | Git pre-commit hooks             |
| lint-staged | Run linters on staged files only |

---

## 📁 Project Structure

```
Watch-Bidding-website/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Watch.js             # Watch + Bid schemas
│   ├── routes/
│   │   ├── auth.js              # /api/auth (signup, login)
│   │   ├── collection.js        # /api/collection (CRUD)
│   │   └── emailRoutes.js       # /api/email
│   └── src/
│       └── index.js             # Express + Socket.io server
├── frontend/
│   └── src/
│       ├── App.js               # Routes
│       ├── Components/
│       │   ├── Navbar/
│       │   ├── Hero/
│       │   ├── BiddingModal/    # Socket.io real-time bidding UI
│       │   ├── ProductDisplay/  # Single watch + live bid
│       │   ├── Collection/      # Auction grid
│       │   └── ...
│       ├── Pages/
│       │   ├── Buy.jsx          # Browse all auctions
│       │   ├── Sell.jsx         # List a watch
│       │   ├── Login.jsx
│       │   └── ...
│       └── Context/
│           └── Context.jsx      # Auth + cart global state
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally (`mongod`) — or MongoDB Atlas URI
- Git

### 1. Clone the repository

```bash
git clone https://github.com/KINGSMAN6150/Watch-Bidding-website.git
cd Watch-Bidding-website
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/auction
JWT_SECRET=your_super_secret_key_here
PORT=3000
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

Start the backend:

```bash
npm run dev
# → Server running on http://localhost:3000
# → MongoDB connected successfully.
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm start
# → App running on http://localhost:3001
```

### 4. Open the app

Navigate to `http://localhost:3001` → Sign up → List a watch → Place bids in two tabs!

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint           | Description         | Auth |
| ------ | ------------------ | ------------------- | ---- |
| POST   | `/api/auth/signup` | Register new user   | ❌   |
| POST   | `/api/auth/login`  | Login → returns JWT | ❌   |

### Collection (Watches)

| Method | Endpoint              | Description                  | Auth |
| ------ | --------------------- | ---------------------------- | ---- |
| GET    | `/api/collection`     | Get all active auctions      | ❌   |
| POST   | `/api/collection`     | List a new watch for auction | ✅   |
| DELETE | `/api/collection/:id` | Remove a watch               | ✅   |

### Email

| Method | Endpoint          | Description        | Auth |
| ------ | ----------------- | ------------------ | ---- |
| POST   | `/api/email/send` | Send contact email | ❌   |

---

## ⚡ Real-Time Bidding — How It Works

```
Browser Tab 1 (bidder)               Server                Browser Tab 2 (viewer)
        │                               │                          │
        │── emit('join-auction', id) ──▶│                          │
        │                               │◀── emit('join-auction') ─│
        │                               │                          │
        │── emit('place-bid', {...}) ──▶│                          │
        │                               │── validates bid ─────────│
        │                               │── saves to MongoDB       │
        │                               │                          │
        │◀── emit('bid-updated') ───────│── emit('bid-updated') ──▶│
        │   (live bid updates)          │   (all in the room)      │
```

Each watch has its own **Socket.io room** (by `watchId`). When a bid is placed:

1. Server validates (must beat current bid, auction not expired)
2. Saves bid to MongoDB
3. Broadcasts `bid-updated` to **all clients in that room**

---

## 🗃️ Data Models

### Watch

```js
{
  name, brand, model, condition, description,
  startingBid, currentBid,
  auction_end_time,
  image,           // Base64 encoded
  seller,          // ref: User
  status,          // 'active' | 'sold' | 'expired'
  bids: [{ bidder, amount, timestamp }],
  winner,          // ref: User
}
```

### User

```js
{
  name, email, phone,
  password,        // bcrypt hashed
}
```

---

## 🔒 Security

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT tokens expire in **24 hours**
- Auth middleware validates token on all protected routes via `x-auth-token` header
- CORS configured to allow only `http://localhost:3001`

---

## 🧹 Code Quality

Pre-commit hook blocks all commits with ESLint or Prettier errors:

```bash
git commit -m "..."
# → Husky runs lint-staged
# → ESLint auto-fixes what it can
# → If unfixable error exists → commit is blocked
# → Fix error → re-stage → commit again
```

---

## 🗺️ Roadmap

See [`full_overhaul_plan.md`](https://github.com/KINGSMAN6150/Watch-Bidding-website) for the full sprint-wise plan.

| Sprint | Theme                                                     | Status     |
| ------ | --------------------------------------------------------- | ---------- |
| 0      | Critical bug fixes                                        | ✅ Done    |
| 1      | Vite + Tailwind + shadcn/ui migration                     | 🔜 Next    |
| 2      | Full UI redesign (dark luxury theme)                      | 📋 Planned |
| 3      | Backend hardening (Swagger, rate limiting, service layer) | 📋 Planned |
| 4      | Payment (Razorpay) + outbid emails + search               | 📋 Planned |
| 5      | Deployment (Railway + MongoDB Atlas + Vercel)             | 📋 Planned |

---

## 👤 Author

**Kingsman6150** · [GitHub](https://github.com/KINGSMAN6150)

---

## 📄 License

This project is for educational purposes.
