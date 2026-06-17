"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  FileText,
  Menu,
  Search,
  Shield,
  X,
} from "lucide-react";
import { getCategories } from "@/services/api";

type NavCategory = {
  id: number;
  name: string;
  slug: string;
};

const HOME_SECTIONS = [
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "benefits", label: "Benefits" },
  { id: "how-it-works", label: "How It Works" },
  { id: "use-cases", label: "Use Cases" },
];

const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [categories, setCategories] = useState<NavCategory[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/categories?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-xl font-extrabold tracking-tight text-neutral-900 shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            ParchaHub
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {isHomePage &&
              HOME_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  {section.label}
                </button>
              ))}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Categories
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    catDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {catDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl border border-neutral-100 shadow-soft p-2 space-y-0.5">
                  <Link
                    href="/categories"
                    onClick={() => setCatDropdownOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 hover:text-brand-blue transition-colors font-medium"
                  >
                    All Categories
                  </Link>
                  <div className="h-px bg-neutral-100 my-1" />
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories?category=${cat.slug}`}
                      onClick={() => setCatDropdownOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 hover:text-brand-blue transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  {categories.length === 0 && (
                    <p className="px-3 py-2 text-sm text-neutral-400">Loading...</p>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleSearch} className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-48 lg:w-56 rounded-full border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue focus:bg-white transition-all"
              />
            </form>

            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-brand-blue transition-colors border border-neutral-200 rounded-full px-4 py-2 hover:border-brand-blue/30"
            >
              <Shield size={14} />
              Admin
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            <form onSubmit={handleSearch} className="relative mb-3">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pamphlets..."
                className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
            </form>

            {isHomePage &&
              HOME_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  {section.label}
                </button>
              ))}

            <div className="pt-2 pb-1 px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Categories
            </div>
            <Link
              href="/categories"
              onClick={closeMobile}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              All Categories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories?category=${cat.slug}`}
                onClick={closeMobile}
                className="block px-3 py-2.5 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                {cat.name}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-neutral-100">
              <Link
                href="/admin/dashboard"
                onClick={closeMobile}
                className="block text-center text-sm font-semibold text-neutral-700 py-2.5 rounded-full border border-neutral-200 hover:border-neutral-300 transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
