"use client";

import { useProduct } from "@/hooks/useApi";
import { useCart } from "@/hooks/useCart";
import { formatPrice, calculateDiscount, resolveImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Tag, Ruler, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading } = useProduct(params.id);
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="animate-pulse grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-100 rounded w-24" />
            <div className="h-8 bg-gray-100 rounded w-full" />
            <div className="h-6 bg-gray-100 rounded w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="p-6">Product not found</div>;

  const discount = calculateDiscount(product.price, product.originalPrice || 0);

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to bag!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/store"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-[#747F86] text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to store
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
            <img
              src={resolveImageUrl(product.images[selectedImage])}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                    selectedImage === i ? "border-[#747F86]" : "border-transparent",
                  )}
                >
                  <img src={resolveImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{product.brand}</p>
          <h1
            className="text-2xl font-semibold text-gray-900 mt-1 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-end gap-3 mb-5">
            <span className="text-2xl font-bold text-[#111111]">{formatPrice(product.price)}</span>
            {(product.sale || 0) > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full mb-0.5">
                Sale {product.sale}%
              </span>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-gray-400 text-lg line-through mb-0.5">{formatPrice(product.originalPrice)}</span>
                <span className="bg-[#747F86] text-white text-xs font-bold px-2 py-1 rounded-full mb-0.5">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium bg-gray-100 text-gray-700">
              <Ruler size={12} />
              Size {product.size}
            </span>
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium bg-gray-100 text-gray-700">
              <Tag size={12} />
              {product.category}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Stock */}
          {product.stock === 1 && (
            <p className="text-amber-600 text-sm font-medium mb-4 flex items-center gap-1.5">
              <Star size={14} className="fill-amber-500 text-amber-500" />
              Only 1 left in stock!
            </p>
          )}

          <Button onClick={handleAdd} disabled={product.stock === 0} className="w-full h-12 text-base">
            <ShoppingBag size={18} className="mr-2" />
            {product.stock === 0 ? "Out of Stock" : "Add to Bag"}
          </Button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Free shipping on orders over $75. Returns within 7 days.
          </p>
        </div>
      </div>
    </div>
  );
}
