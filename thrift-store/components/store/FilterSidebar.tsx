'use client';

import { ProductFilters, ProductCategory, ProductCondition, ProductSize } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

const categories: { label: string; value: ProductCategory }[] = [
  { label: 'Tops', value: 'tops' },
  { label: 'Bottoms', value: 'bottoms' },
  { label: 'Dresses', value: 'dresses' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Shoes', value: 'shoes' },
  { label: 'Bags', value: 'bags' },
  { label: 'Accessories', value: 'accessories' },
];

const conditions: { label: string; value: ProductCondition }[] = [
  { label: 'Like New', value: 'like-new' },
  { label: 'Good', value: 'good' },
  { label: 'Fair', value: 'fair' },
  { label: 'Well Worn', value: 'worn' },
];

const sizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const toggle = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    onChange({ ...filters, [key]: filters[key] === value ? undefined : value, page: 1 });
  };

  const reset = () => onChange({});

  const hasFilters = filters.category || filters.condition || filters.size || filters.minPrice || filters.maxPrice;

  return (
    <aside className="w-52 shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#06365b]">Filters</h3>
        {hasFilters && (
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600">
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Category</h4>
        <div className="space-y-1">
          {categories.map(c => (
            <button
              key={c.value}
              onClick={() => toggle('category', c.value)}
              className={cn(
                'w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors',
                filters.category === c.value
                  ? 'bg-[#06365b] text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Condition</h4>
        <div className="space-y-1">
          {conditions.map(c => (
            <button
              key={c.value}
              onClick={() => toggle('condition', c.value)}
              className={cn(
                'w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors',
                filters.condition === c.value
                  ? 'bg-[#06365b] text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Size</h4>
        <div className="grid grid-cols-3 gap-1">
          {sizes.map(s => (
            <button
              key={s}
              onClick={() => toggle('size', s)}
              className={cn(
                'px-2 py-1.5 rounded-md text-xs font-medium border transition-colors',
                filters.size === s
                  ? 'bg-[#06365b] text-white border-[#06365b]'
                  : 'text-gray-600 border-gray-200 hover:border-[#06365b] hover:text-[#06365b]'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Price</h4>
        <div className="space-y-1">
          {[
            { label: 'Under $30', min: 0, max: 30 },
            { label: '$30 - $60', min: 30, max: 60 },
            { label: '$60 - $100', min: 60, max: 100 },
            { label: 'Over $100', min: 100, max: 99999 },
          ].map(range => (
            <button
              key={range.label}
              onClick={() => onChange({
                ...filters,
                minPrice: filters.minPrice === range.min ? undefined : range.min,
                maxPrice: filters.maxPrice === range.max ? undefined : range.max,
                page: 1
              })}
              className={cn(
                'w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors',
                filters.minPrice === range.min && filters.maxPrice === range.max
                  ? 'bg-[#06365b] text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
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
