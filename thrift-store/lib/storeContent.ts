export const BRAND_NAME = "Tudo4NoReason";
export const BRAND_TAGLINE = "Vintage denim";

export const BRAND_COLORS = {
  steel: "#747F86",
  earth: "#78511D",
  black: "#111111",
  white: "#ffffff",
};

export const LANDING_HERO = {
  title: "Tudo4NoReason Vintage denim",
  subtitle: "Mỗi đợt drop có thể đổi ảnh, thay copy sale hoặc update highlight tại file lib/storeContent.ts.",
  ctaText: "Shop Drop",
  ctaHref: "/store",
  badge: "New Drop",
  saleText: "Weekend Sale up to 20%",
  images: ["/images/gallery_1.jpg", "/images/gallery_2.jpg", "/images/gallery_3.jpg"],
};

export const SHOP_SECTIONS = [
  { label: "Top", href: "/store?category=Top", description: "Áo, áo khoác,..." },
  { label: "Bottom", href: "/store?category=Bottom", description: "Short, dài,..." },
  { label: "Accessories", href: "/store?category=Accessories", description: "Dây nịt, phụ kiện,..." },
];

export const SIZE_RANGES = ["28-29", "30-31", "32-33", "34+"] as const;

export type ProductSizeRange = (typeof SIZE_RANGES)[number];

export const GALLERY_ITEMS = [
  {
    src: "/images/gallery_1.jpg",
    alt: "Tudo4NoReason look 1",
  },
  {
    src: "/images/gallery_2.jpg",
    alt: "Tudo4NoReason look 2",
  },
  {
    src: "/images/gallery_3.jpg",
    alt: "Tudo4NoReason look 3",
  },
];
