# Simple chat functionality with authentication on NextJS

A simple prototype to demonstrate a real-time buyer-seller counter-offer chat feature built using **Next.js** (frontend) and **Socket.IO** (backend).  
Frontend is hosted on **Vercel** and the backend Socket.IO server is hosted on **Render**.

---

## ✨ Features

- Real-time messaging between buyer and seller
- Socket.IO for bidirectional communication
- TypeScript support
- Simple offer status tracking (`pending`, `accepted`, `rejected`)
- Production-ready with CORS, deployment, and `.env` setup

---

## 📁 Tech Stack

| Tech       | Description                         |
|------------|-------------------------------------|
| Next.js    | Frontend framework                  |
| React      | UI library                          |
| Socket.IO  | Real-time WebSocket communication   |
| Express    | Lightweight backend for Socket.IO   |
| TypeScript | Static typing                       |
| Vercel     | Frontend hosting                    |
| Render     | Backend Socket.IO hosting           |

---

## 🧑‍💻 Project Structure

```bash
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── logout/
│   │           └── route.ts
│   │       └── login/
│   │           └── route.ts
│   ├── components/
│   └── login/
│       └── page.tsx
│   └── chat/
│       ├── buyer/
│       │   └── page.tsx
│       └── seller/
│           └── page.tsx
├── lib/
│   ├── auth.ts
│   └── socket.ts
├── socket-server/
│   ├── index.ts
├── middleware.ts
```
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
