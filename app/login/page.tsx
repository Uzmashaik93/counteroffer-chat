"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const router = useRouter();

  const login = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.role === "buyer") {
        router.push("/chat/buyer");
      } else if (data.role === "seller") {
        router.push("/chat/seller");
      }
    } else {
      alert("Login Falied" + data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-0">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Login
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Name
            </label>
            <input
              type="name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              await login();
            }}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
          >
            Sign In
          </button>
          {token && (
            <div>
              <p>Token: {token}</p>
              <a href="/chat/buyer">Go to Buyer Dashboard</a>
              <a href="/chat/seller">Go to Seller Dashboard</a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
