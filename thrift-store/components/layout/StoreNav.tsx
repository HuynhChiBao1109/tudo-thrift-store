'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { CartDrawer } from '@/components/store/CartDrawer';

export function StoreNav() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const categories = [
    { label: 'All', href: '/store' },
    { label: 'Tops', href: '/store?category=tops' },
    { label: 'Bottoms', href: '/store?category=bottoms' },
    { label: 'Dresses', href: '/store?category=dresses' },
    { label: 'Outerwear', href: '/store?category=outerwear' },
    { label: 'Shoes', href: '/store?category=shoes' },
    { label: 'Bags', href: '/store?category=bags' },
    { label: 'Accessories', href: '/store?category=accessories' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-[#06365b]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#06365b] rounded-full flex items-center justify-center">
                <Heart size={14} className="text-white fill-white" />
              </div>
              <span
                className="text-xl font-bold text-[#06365b] hidden sm:block"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                ReThread
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {categories.map(c => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="text-sm text-gray-600 hover:text-[#06365b] font-medium transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link href="/store" className="p-2 text-gray-600 hover:text-[#06365b]">
                <Search size={20} />
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-[#06365b] transition-colors"
              >
                <ShoppingBag size={20} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#06365b] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3">
            {categories.map(c => (
              <Link
                key={c.label}
                href={c.href}
                className="block py-2 text-sm text-gray-600 hover:text-[#06365b] font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
