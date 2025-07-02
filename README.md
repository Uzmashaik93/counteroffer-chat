# 🔐 Next.js 15 Role-Based Auth Prototype (Buyer/Seller)

This is a simple prototype demonstrating **role-based authentication** in **Next.js 15 (App Router)** using:

- ✅ JWTs stored in `localStorage`
- ✅ Role-based redirection (buyer vs seller)
- ✅ Client-side route protection
- ✅ Login and logout functionality

---

## ✨ Features

- Hardcoded users:
  - `buyer1 / pass123`
  - `seller1 / pass456`
- JWT token is generated on login and stored in `localStorage`
- Authenticated routes:
  - `/chat/buyer` → accessible only to buyers
  - `/chat/seller` → accessible only to sellers
- Redirects unauthenticated or unauthorized users
- Clean separation of auth logic, components, and pages

---

## 🧱 Stack

- [Next.js 15 (App Router)](https://nextjs.org/docs/app)
- TypeScript
- JWT (in-memory/localStorage)
- No database — hardcoded credentials

---

## 🚀 Getting Started

### 1. Clone this repo

```bash
git clone https://github.com/your-username/nextjs-role-auth-prototype.git
cd nextjs-role-auth-prototype
```

### 2. npm install

### 3. npm run dev

##  License
This project is for demo and prototype purposes only.
