"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useBrands } from "@/hooks/useApi";
import { CartDrawer } from "@/components/store/CartDrawer";
import { BRAND_NAME, BRAND_TAGLINE, SHOP_SECTIONS } from "@/lib/storeContent";

export function StoreNav() {
  const { count } = useCart();
  const { data: brandsResponse } = useBrands();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const topLinks = [
    { label: "Tee", href: "/store?category=Top&search=tee" },
    { label: "Top", href: "/store?category=Top&search=top" },
  ];

  const bottomLinks = [
    { label: "Pants", href: "/store?category=Bottom&search=pants" },
    { label: "Shorts", href: "/store?category=Bottom&search=shorts" },
  ];

  const accessoriesLinks = [
    { label: "Belt", href: "/store?category=Accessories&search=belt" },
    { label: "Accessories", href: "/store?category=Accessories&search=accessories" },
  ];

  const brandLinks = (brandsResponse?.data || []).map((brand) => ({
    label: brand.name,
    href: `/store?brandId=${encodeURIComponent(brand.id)}`,
  }));

  const shopHoverGroups = [
    { label: "Top", href: SHOP_SECTIONS[0]?.href || "/store?category=Top", links: topLinks },
    { label: "Bottom", href: SHOP_SECTIONS[1]?.href || "/store?category=Bottom", links: bottomLinks },
    {
      label: "Accessories",
      href: SHOP_SECTIONS[2]?.href || "/store?category=Accessories",
      links: accessoriesLinks,
    },
    { label: "Brand", href: "/store", links: brandLinks },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#d4d6d9] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-28">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image
                src="/images/logo.jpg"
                alt={BRAND_NAME}
                width={280}
                height={96}
                className="h-24 w-auto object-contain"
                priority
              />
              <div className="hidden sm:flex flex-col leading-none">
                <span
                  className="brand-font text-2xl tracking-widest text-[#111111]"
                  style={{ letterSpacing: "0.08em" }}
                >
                  {BRAND_NAME}
                </span>
                <span
                  className="text-xs tracking-[0.3em] uppercase text-[#747F86] mt-0.5"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 300 }}
                >
                  {BRAND_TAGLINE}
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-sm text-[#111111]">
              <div className="relative group">
                <Link
                  href="/store"
                  className="block py-2 font-medium hover:text-[#747F86] transition-colors tracking-wide cursor-pointer"
                >
                  SHOP
                </Link>

                <div className="absolute left-0 top-full -mt-px z-20 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
                  <div className="w-56 rounded-xl border border-[#d4d6d9] bg-white shadow-lg p-2">
                    {shopHoverGroups.map((group) => (
                      <div key={group.label} className="relative group/submenu">
                        <Link
                          href={group.href}
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-[#f3f4f5] hover:text-[#747F86]"
                        >
                          {group.label}
                          <ChevronRight size={14} />
                        </Link>

                        <div className="absolute left-full top-0 min-w-52 rounded-xl border border-[#d4d6d9] bg-white shadow-lg p-2 opacity-0 pointer-events-none group-hover/submenu:opacity-100 group-hover/submenu:pointer-events-auto transition-all">
                          {group.links.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-gray-400">No items</p>
                          ) : (
                            group.links.map((item) => (
                              <Link
                                key={`${group.label}-${item.href}`}
                                href={item.href}
                                className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-[#f3f4f5] hover:text-[#747F86]"
                              >
                                {item.label}
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/store#gallery" className="font-medium hover:text-[#747F86] transition-colors tracking-wide">
                GALLERY
              </Link>

              <Link href="/store/about" className="font-medium hover:text-[#747F86] transition-colors tracking-wide">
                ABOUT US
              </Link>

              <Link href="/store/contact" className="font-medium hover:text-[#747F86] transition-colors tracking-wide">
                CONTACT US
              </Link>
            </nav>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-[#111111] hover:text-[#747F86] transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart size={24} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </button>

              <button
                className="lg:hidden px-3 py-1.5 text-sm text-[#747F86] tracking-wide"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? "CLOSE" : "MENU"}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-[#d4d6d9] bg-white px-4 py-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-1 py-1">SHOP</p>
              <Link
                href="/store"
                className="block px-2 py-2 text-sm text-gray-700 hover:text-[#747F86] hover:bg-[#f3f4f5] rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                All
              </Link>

              {shopHoverGroups.map((group) => (
                <div key={`mobile-${group.label}`} className="py-1">
                  <Link
                    href={group.href}
                    className="block px-2 py-2 text-sm font-medium text-[#111111] hover:text-[#747F86] hover:bg-[#f3f4f5] rounded-md"
                    onClick={() => setMenuOpen(false)}
                  >
                    {group.label}
                  </Link>

                  <div className="pl-3 space-y-1 mt-1">
                    {group.links.length === 0 ? (
                      <p className="px-2 py-1 text-xs text-gray-400">No items</p>
                    ) : (
                      group.links.map((item) => (
                        <Link
                          key={`mobile-${group.label}-${item.href}`}
                          href={item.href}
                          className="block px-2 py-1.5 text-xs text-gray-600 hover:text-[#747F86] hover:bg-[#f3f4f5] rounded-md"
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              ))}

              <div className="h-px bg-[#e9ecef] my-2" />

              <Link
                href="/store#gallery"
                className="block px-2 py-2 text-sm text-gray-700 hover:text-[#747F86] hover:bg-[#f3f4f5] rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                GALLERY
              </Link>

              <Link
                href="/store/contact"
                className="block px-2 py-2 text-sm text-gray-700 hover:text-[#747F86] hover:bg-[#f3f4f5] rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                CONTACT US
              </Link>
              <Link
                href="/store/about"
                className="block px-2 py-2 text-sm text-gray-700 hover:text-[#747F86] hover:bg-[#f3f4f5] rounded-md"
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
