"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getConditionLabel, getConditionColor, calculateDiscount, resolveImageUrl, cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";
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
    <Link href={`/store/products/${product.id}`} className={cn("group block", className)}>
      <div className="relative overflow-hidden rounded-xl bg-gray-50">
        {/* Image */}
        <div className="aspect-[3/4] relative overflow-hidden">
          <img
            src={resolveImageUrl(product.images[0])}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-[#003966] text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlisted(!wishlisted);
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all"
          >
            <Heart size={14} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-600"} />
          </button>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            className={cn(
              "absolute bottom-3 left-3 right-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
              "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
              added ? "bg-emerald-500 text-white" : "bg-[#003966] text-white hover:bg-[#003966]/90",
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
              <p className="text-xs text-gray-400 uppercase tracking-wide truncate">{product.brand}</p>
              <h3 className="font-medium text-gray-900 text-sm leading-tight mt-0.5 truncate">{product.name}</h3>
            </div>
            <span
              className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0",
                getConditionColor(product.condition),
              )}
            >
              {getConditionLabel(product.condition)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-[#003966] font-bold">{formatPrice(product.price)}</span>
            {(product.sale || 0) > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">
                Sale {product.sale}%
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="text-gray-400 text-xs ml-auto">Size {product.size}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
