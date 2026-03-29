export const PRODUCT_CATEGORY_OPTIONS = [
  { label: "Top", value: "Top" },
  { label: "Bottom", value: "Bottom" },
  { label: "Accessories", value: "Accessories" },
] as const;

export const PRODUCT_SUBCATEGORY_OPTIONS = {
  Top: ["Tee", "Top"],
  Bottom: ["Pants", "Shorts"],
  Accessories: ["Belt", "Accessories"],
} as const;
