"use client";

import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, calculateDiscount, resolveImageUrl, cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const discount = calculateDiscount(product.price, product.originalPrice || 0);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/store/products/${product.slug || product.id}`} className={cn("group block", className)}>
      <div className="street-card relative overflow-hidden rounded-xl transition-all duration-300 group-hover:-translate-y-0.5">
        {/* Image */}
        <div className="aspect-[3/4] relative overflow-hidden border-b border-[#e9ecef]">
          <img
            src={resolveImageUrl(product.images[0])}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-[#747F86] text-white text-[10px] font-semibold px-2.5 py-1 rounded-md vintage-header">
              -{discount}%
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlisted(!wishlisted);
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white border border-[#d4d6d9] rounded-md flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all"
          >
            <Heart size={14} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-600"} />
          </button>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            className={cn(
              "absolute bottom-3 left-3 right-3 py-2 rounded-md text-xs font-medium transition-all duration-300 tracking-wide",
              "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
              added ? "bg-emerald-500 text-white" : "bg-[#78511D] text-white hover:bg-[#6d491a]",
            )}
          >
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag size={14} />
              {added ? "Added!" : "Add to Bag"}
            </span>
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] text-[#747F86] uppercase tracking-wider truncate">{product.brand}</p>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight mt-0.5 truncate">{product.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-[#111111] font-bold">{formatPrice(product.price)}</span>
            {(product.sale || 0) > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">
                Sale {product.sale}%
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="text-gray-500 text-xs ml-auto">Size {product.size}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
