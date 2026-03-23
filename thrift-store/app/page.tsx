"use client";

import { useProducts } from "@/hooks/useApi";
import { StoreNav } from "@/components/layout/StoreNav";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { data, isLoading } = useProducts();
  const products = data?.data || [];

  return (
    <div className="min-h-screen bg-white">
      <StoreNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <section>
          <h1
            className="text-4xl sm:text-5xl text-[#003966] tracking-wide"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            STREET GALLERY
          </h1>
          <p className="text-gray-500 mt-2">Scroll down to explore products</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl overflow-hidden bg-gray-100 md:col-span-2">
              <img
                src="/images/gallery_1.jpg"
                alt="Gallery image 1"
                className="w-full h-[300px] sm:h-[420px] object-cover"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src="/images/gallery_2.jpg"
                  alt="Gallery image 2"
                  className="w-full h-[145px] sm:h-[202px] object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src="/images/gallery_3.jpg"
                  alt="Gallery image 3"
                  className="w-full h-[145px] sm:h-[202px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 sm:mt-12">
          <h2
            className="text-3xl sm:text-4xl text-[#003966] tracking-wide"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            PRODUCTS
          </h2>

          {isLoading ? (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mt-5 text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded-xl">
              No products found
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
