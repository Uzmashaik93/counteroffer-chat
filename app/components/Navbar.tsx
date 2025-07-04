"use client";

import {
  Bell,
  ChevronDown,
  Heart,
  LogOut,
  MessageCircle,
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import logo from "@/public/images/trendies.svg";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="w-full text-sm">
      {/* Top Row */}
      <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-4 md:mr-20 md:ml-20">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo */}
        <div className="flex-1 flex justify-left ml-3 md:justify-start gap-3">
          <div>
            <Image
              src={logo}
              alt="logo"
              width={132.75}
              height={39}
              className="md:w-[177px] md:h-[52px] w-[132.75px] h-[39px]"
              priority
            />
          </div>
          <div className="mt-auto text-lg font-semibold">
            {pathname.startsWith("/chat/seller") && <p className="">SELLER</p>}
          </div>
        </div>

        {/* Right: Icons (mobile) */}
        <div className="flex items-center gap-4 md:hidden">
          <Heart strokeWidth={2} size={20} />
          <ShoppingBag strokeWidth={2} size={20} />
          <User strokeWidth={2} size={20} />
        </div>

        {/* Center: Become a Seller (desktop only) */}
        <div className="hidden md:flex justify-center ml-[18vw] flex-1">
          <button className="bg-black text-white px-4 py-2 hover:bg-gray-800">
            Become a Seller
          </button>
        </div>

        {/* Right: Icons (desktop only) */}
        <div className="hidden md:flex items-center gap-4 text-gray-700 text-sm">
          <span className="hidden sm:flex items-center font-bold gap-1">
            EN
            <ChevronDown strokeWidth={2} />
          </span>
          <span>
            <Heart strokeWidth={2} size={20} />
          </span>
          <span>
            <MessageCircle strokeWidth={2} size={20} />
          </span>
          <span>
            <Bell strokeWidth={2} size={20} />
          </span>
          <span>
            <ShoppingBag strokeWidth={2} size={20} />
          </span>
          <span>
            <User strokeWidth={2} size={20} />
          </span>
          <span>
            <LogOut strokeWidth={2} size={20} className="cursor-pointer" />
          </span>
        </div>
      </div>

      {/* Mobile menu (optional, can add links here if needed) */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          {/* Example: Add mobile nav links or actions here */}
          <nav className="flex flex-col gap-4">
            {[
              "All",
              "Watches",
              "Jewellery",
              "Bags",
              "Shoes",
              "Accessories",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-black transition-colors"
              >
                {item}
              </a>
            ))}
            <button className="bg-black text-white px-4 py-2 rounded mt-2">
              Become a Seller
            </button>
          </nav>
        </div>
      )}

      <div className="border-b border-gray-200 w-full" />
      {/* Bottom Row (desktop only) */}
      <div className="hidden md:flex flex-col md:mt-1 ml-20 mr-1 md:flex-row justify-between items-center px-6 py-2 border-gray-100 gap-3 md:gap-0">
        {/* Left: Category Navigation */}
        <nav className="flex gap-10 flex-wrap text-black whitespace-nowrap">
          {["All", "Watches", "Jewellery", "Bags", "Shoes", "Accessories"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="hover:text-black transition-colors"
              >
                {item}
              </a>
            )
          )}
        </nav>

        {/* Right: Search Bar */}
        <div className="w-full md:w-72 mt-2 md:mt-0 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-3/4 px-4 py-2 pl-10 border border-gray-200 text-sm focus:outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
        </div>
      </div>
    </div>
  );
}
