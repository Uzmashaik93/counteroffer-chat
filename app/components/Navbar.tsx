"use client";

import {
  FaChevronDown,
  FaHeart,
  FaBell,
  FaShoppingBag,
  FaUser,
  FaRegCommentDots,
} from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 h-16 bg-white flex items-center w-full">
      <div className="w-full px-0 flex justify-between items-center h-full">
        {/* Left: Logo + Tagline */}
        <div className="flex items-center gap-2 pl-4">
          <span className="text-4xl font-bold text-gray-900">trendies</span>
        </div>

        {/* Center: CTA */}
        <button className="text-sm px-4 py-2 bg-black text-white hover:bg-gray-800">
          Sell with us
        </button>

        {/* Right: Menu + Icons */}
        <div className="flex items-center gap-5 pr-4">
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
    </nav>
  );
}
