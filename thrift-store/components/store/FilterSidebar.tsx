"use client";

import { Brand, ProductFilters } from "@/types";
import { cn } from "@/lib/utils";
import { SHOP_SECTIONS } from "@/lib/storeContent";
import { Input } from "@/components/ui/input";

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

  const sizeOptions = Array.from({ length: 21 }, (_, index) => index + 20);

  const toggleSize = (size: number) => {
    const currentSizes = filters.size || [];
    const nextSizes = currentSizes.includes(size)
      ? currentSizes.filter((item) => item !== size)
      : [...currentSizes, size].sort((a, b) => a - b);

    onChange({
      ...filters,
      size: nextSizes.length > 0 ? nextSizes : undefined,
      page: 1,
    });
  };

  const updatePrice = (key: "minPrice" | "maxPrice", value: string) => {
    onChange({
      ...filters,
      [key]: value === "" ? undefined : Number(value),
      page: 1,
    });
  };

  const reset = () => onChange({});

  const hasFilters =
    filters.category ||
    filters.brandId ||
    (filters.size && filters.size.length > 0) ||
    typeof filters.minPrice === "number" ||
    typeof filters.maxPrice === "number";

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

      {/* <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Size</h4>
        <div className="grid grid-cols-3 gap-1">
          {sizeOptions.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "px-2 py-1.5 rounded-md text-xs font-medium border transition-colors",
                filters.size?.includes(size)
                  ? "bg-[#747F86] text-white border-[#747F86]"
                  : "text-gray-700 border-gray-300 hover:border-[#78511D] hover:text-[#78511D]",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div> */}

      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Price</h4>
        <div className="space-y-2">
          <div>
            <label className="text-[11px] text-gray-500 mb-1 block">From</label>
            <Input
              type="number"
              min={0}
              value={filters.minPrice ?? ""}
              onChange={(e) => updatePrice("minPrice", e.target.value)}
              placeholder="Ví dụ: 100000"
              className="h-9 text-sm"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 mb-1 block">To</label>
            <Input
              type="number"
              min={0}
              value={filters.maxPrice ?? ""}
              onChange={(e) => updatePrice("maxPrice", e.target.value)}
              placeholder="Ví dụ: 500000"
              className="h-9 text-sm"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
