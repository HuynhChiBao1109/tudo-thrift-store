"use client";

import Link from "next/link";
import { Flower2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useBrands, useCategories } from "@/hooks/useApi";
import { CartDrawer } from "@/components/store/CartDrawer";

interface StoreNavProps {
  showIcon?: boolean;
}

export function StoreNav({ showIcon = true }: StoreNavProps) {
  const { count } = useCart();
  const { data: categoriesResponse } = useCategories();
  const { data: brandsResponse } = useBrands();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const categoryLinks = [
    { label: "All", href: "/store" },
    ...(categoriesResponse?.data || []).map((category) => ({
      label: category.name,
      href: `/store?category=${encodeURIComponent(category.name)}`,
    })),
  ];

  const brandLinks = (brandsResponse?.data || []).map((brand) => ({
    label: brand.name,
    href: `/store?brandId=${encodeURIComponent(brand.id)}`,
  }));

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fffdf8] border-b border-[#dfd2bd] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              {showIcon && (
                <div className="w-9 h-9 bg-[#003966] rounded-full flex items-center justify-center shadow-sm">
                  <Flower2 size={15} className="text-white" />
                </div>
              )}
              <span
                className="text-2xl sm:text-3xl text-[#003966] tracking-wide"
                style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
              >
                Tudo4Noreason
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-7 text-lg text-gray-800">
              <div className="relative group">
                <button
                  className="font-semibold hover:text-[#003966] transition-colors tracking-wide"
                  style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
                >
                  SHOP ▼
                </button>

                <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-[#dfd2bd] bg-white shadow-lg p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-20">
                  {categoryLinks.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="block px-3 py-2 rounded-lg text-base text-gray-700 hover:bg-amber-50 hover:text-[#003966]"
                      style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <button
                  className="font-semibold hover:text-[#003966] transition-colors tracking-wide"
                  style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
                >
                  BRAND ▼
                </button>

                <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-[#dfd2bd] bg-white shadow-lg p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-20 max-h-80 overflow-y-auto">
                  {brandLinks.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-gray-400">No brands</p>
                  ) : (
                    brandLinks.map((brand) => (
                      <Link
                        key={brand.href}
                        href={brand.href}
                        className="block px-3 py-2 rounded-lg text-base text-gray-700 hover:bg-amber-50 hover:text-[#003966]"
                        style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
                      >
                        {brand.label}
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <Link
                href="/store/about"
                className="font-semibold hover:text-[#003966] transition-colors tracking-wide"
                style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
              >
                ABOUT US
              </Link>

              <Link
                href="/store/contact"
                className="font-semibold hover:text-[#003966] transition-colors tracking-wide"
                style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
              >
                CONTACT US
              </Link>
            </nav>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCartOpen(true)}
                className="px-3 py-1.5 text-base text-gray-700 hover:text-[#003966] transition-colors tracking-wide"
                style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
                aria-label="Open cart"
              >
                CART {count > 0 ? `(${count})` : ""}
              </button>

              <button
                className="lg:hidden px-3 py-1.5 text-base text-[#003966] tracking-wide"
                style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? "CLOSE" : "MENU"}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-[#dfd2bd] bg-[#fffdf8] px-4 py-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-1 py-1">SHOP</p>
              {categoryLinks.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="block px-2 py-2 text-base text-gray-700 hover:text-[#003966] hover:bg-amber-50 rounded-md"
                  style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {category.label}
                </Link>
              ))}

              <div className="h-px bg-[#efe7d7] my-2" />

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-1 py-1">BRAND</p>
              {brandLinks.map((brand) => (
                <Link
                  key={brand.href}
                  href={brand.href}
                  className="block px-2 py-2 text-base text-gray-700 hover:text-[#003966] hover:bg-amber-50 rounded-md"
                  style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {brand.label}
                </Link>
              ))}

              <div className="h-px bg-[#efe7d7] my-2" />

              <Link
                href="/store/contact"
                className="block px-2 py-2 text-base text-gray-700 hover:text-[#003966] hover:bg-amber-50 rounded-md"
                style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
                onClick={() => setMenuOpen(false)}
              >
                CONTACT US
              </Link>
              <Link
                href="/store/about"
                className="block px-2 py-2 text-base text-gray-700 hover:text-[#003966] hover:bg-amber-50 rounded-md"
                style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
                onClick={() => setMenuOpen(false)}
              >
                ABOUT US
              </Link>
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
