"use client";

import Link from "next/link";
import { Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const userName = user?.name || "Profile";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 md:gap-6">
        <Link
          href="/"
          className="shrink-0 font-heading text-2xl font-extrabold tracking-tight text-neutral-900"
        >
          <Image src="./logo.svg" alt="company-logo" width={50} height={50} />
        </Link>

        <div className="flex-1 hidden md:flex items-center">
          <label className="w-full relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
              size={18}
            />
            <input
              type="search"
              placeholder="Search pamphlets, categories, locations..."
              className="w-full rounded-full border border-brand-border bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:border-brand-blue hover:text-brand-blue transition-colors"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold">
                {userInitial}
              </span>
              <span className="max-w-[90px] truncate hidden sm:inline">
                {userName}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:border-brand-blue hover:text-brand-blue transition-colors"
            >
              <User size={16} />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
