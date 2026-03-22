"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useProducts, useBrands } from "@/hooks/useApi";
import { ProductCard } from "@/components/store/ProductCard";
import { FilterSidebar } from "@/components/store/FilterSidebar";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFilters } from "@/types";
export default function StorePage() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setFilters({
      category:
        (params.get("category") as ProductFilters["category"]) || undefined,
      featured: params.get("featured") === "true" ? true : undefined,
    });
  }, []);

  const { data, isLoading } = useProducts({
    ...filters,
    search: search || undefined,
  });
  const { data: brandsResponse } = useBrands();
  const brands = brandsResponse?.data || [];
  const products = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold text-[#003966]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {filters.category
            ? filters.category.charAt(0).toUpperCase() +
              filters.category.slice(1)
            : filters.featured
              ? "Featured Picks"
              : "All Items"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isLoading
            ? "Loading..."
            : `${total} item${total !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, brand..."
            className="pl-9"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        <Select
          value={filters.sortBy || ""}
          onValueChange={(v) =>
            setFilters((prev) => ({
              ...prev,
              sortBy: v as ProductFilters["sortBy"],
            }))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-8">
        {/* Filters - desktop always visible */}
        <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            brands={brands}
          />
        </div>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-medium">No items found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
