"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 h-16 bg-white flex items-center w-full">
      <div className="w-full px-0 flex justify-between items-center h-full">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 pl-4 hover:cursor-pointer">
          <Link href="/">
            <span className="text-2xl md:text-4xl font-bold text-gray-900">
              trendies
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
