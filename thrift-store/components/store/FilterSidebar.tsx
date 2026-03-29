"use client";

import { Brand, ProductFilters } from "@/types";
import { cn } from "@/lib/utils";
import { SHOP_SECTIONS, SIZE_RANGES } from "@/lib/storeContent";

interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  brands: Brand[];
}

export function FilterSidebar({ filters, onChange, brands }: FilterSidebarProps) {
  const toggle = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    onChange({
      ...filters,
      [key]: filters[key] === value ? undefined : value,
      page: 1,
    });
  };

  const reset = () => onChange({});

  const hasFilters = filters.category || filters.brandId || filters.size || filters.minPrice || filters.maxPrice;

  return (
    <aside className="w-52 shrink-0 text-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#111111]">Filters</h3>
        {hasFilters && (
          <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-700">
            Clear all
          </button>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Category</h4>
        <div className="space-y-1">
          {SHOP_SECTIONS.map((item) => (
            <button
              key={item.label}
              onClick={() => toggle("category", item.label)}
              className={cn(
                "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                filters.category === item.label
                  ? "bg-[#747F86] text-white font-medium"
                  : "text-gray-700 hover:bg-[#f3f4f5]",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Brand</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => toggle("brandId", brand.id)}
              className={cn(
                "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                filters.brandId === brand.id
                  ? "bg-[#747F86] text-white font-medium"
                  : "text-gray-700 hover:bg-[#f3f4f5]",
              )}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Size</h4>
        <div className="grid grid-cols-2 gap-1">
          {SIZE_RANGES.map((size) => (
            <button
              key={size}
              onClick={() => toggle("size", size as ProductFilters["size"])}
              className={cn(
                "px-2 py-1.5 rounded-md text-xs font-medium border transition-colors",
                filters.size === size
                  ? "bg-[#747F86] text-white border-[#747F86]"
                  : "text-gray-700 border-gray-300 hover:border-[#78511D] hover:text-[#78511D]",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Price</h4>
        <div className="space-y-1">
          {[
            { label: "Under $30", min: 0, max: 30 },
            { label: "$30 - $60", min: 30, max: 60 },
            { label: "$60 - $100", min: 60, max: 100 },
            { label: "Over $100", min: 100, max: 99999 },
          ].map((range) => (
            <button
              key={range.label}
              onClick={() =>
                onChange({
                  ...filters,
                  minPrice: filters.minPrice === range.min ? undefined : range.min,
                  maxPrice: filters.maxPrice === range.max ? undefined : range.max,
                  page: 1,
                })
              }
              className={cn(
                "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                filters.minPrice === range.min && filters.maxPrice === range.max
                  ? "bg-[#747F86] text-white font-medium"
                  : "text-gray-700 hover:bg-[#f3f4f5]",
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
