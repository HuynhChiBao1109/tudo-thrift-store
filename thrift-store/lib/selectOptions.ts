export const PRODUCT_CATEGORY_OPTIONS = [
  { label: "Top", value: "Top" },
  { label: "Bottom", value: "Bottom" },
  { label: "Accessories", value: "Accessories" },
] as const;

export const PRODUCT_SUBCATEGORY_OPTIONS = {
  Top: ["Áo dài", "Áo khoác"],
  Bottom: ["Quần dài", "Quần đùi"],
  Accessories: ["Dây nịt", "Phụ kiện"],
} as const;
