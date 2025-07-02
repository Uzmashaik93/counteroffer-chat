"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <button
      onClick={logout}
      className=" px-2 py-2 bg-white border border-gray-300 rounded-md shadow text-gray-800 hover:bg-gray-50 transition mb-2 ml-2"
    >
      Logout
    </button>
  );
}
