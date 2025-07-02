"use client";

import {
  FaChevronDown,
  FaHeart,
  FaBell,
  FaShoppingBag,
  FaUser,
  FaRegCommentDots,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 h-16 bg-white flex items-center w-full">
      <div className="w-full px-0 flex justify-between items-center h-full">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 pl-4">
          <span className="text-2xl md:text-4xl font-bold text-gray-900">
            trendies
          </span>
        </div>

        {/* Center: CTA (hidden on mobile) */}
        <button className="hidden md:block text-sm px-4 py-2 bg-black text-white hover:bg-gray-800">
          Sell with us
        </button>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden pr-4"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Open menu"
        >
          {mobileMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>

        {/* Right: Menu + Icons (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-5 pr-4">
          <button className="flex items-center text-sm text-gray-700 hover:text-black">
            EN <FaChevronDown className="ml-1 w-3 h-3" />
          </button>
          <FaHeart className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
          <div className="relative">
            <FaRegCommentDots className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
              3
            </span>
          </div>
          <FaBell className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
          <FaShoppingBag className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
          <FaUser className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-white/20 backdrop-blur-xs backdrop-saturate-150 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-16 right-0 w-56 bg-white shadow-lg rounded-l-lg p-4 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="text-sm px-4 py-2 bg-black text-white hover:bg-gray-800 rounded">
              Sell with us
            </button>
            <button className="flex items-center text-sm text-gray-700 hover:text-black">
              EN <FaChevronDown className="ml-1 w-3 h-3" />
            </button>
            <FaHeart className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
            <div className="relative">
              <FaRegCommentDots className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                3
              </span>
            </div>
            <FaBell className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
            <FaShoppingBag className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
            <FaUser className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
          </div>
        </div>
      )}
    </nav>
  );
}
