export const PRODUCT_CATEGORY_OPTIONS = [
  { label: "Top", value: "top" },
  { label: "Tee", value: "tee" },
  { label: "Pant", value: "pant" },
  { label: "Bottom", value: "bottom" },
  { label: "Shorts", value: "short" },
  { label: "Belt", value: "belt" },
  { label: "Accessories", value: "accessories" },
  { label: "Other", value: "other" },
] as const;

export const PRODUCT_SUBCATEGORY_OPTIONS = {
  Top: ["Tee", "Top"],
  Bottom: ["Pants", "Shorts"],
  Accessories: ["Belt", "Accessories"],
} as const;
