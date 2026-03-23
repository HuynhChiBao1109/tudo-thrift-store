import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    "like-new": "Like New",
    good: "Good",
    fair: "Fair",
    worn: "Well Worn",
  };
  return labels[condition] || condition;
}

export function getConditionColor(condition: string): string {
  const colors: Record<string, string> = {
    "like-new": "bg-emerald-100 text-emerald-700",
    good: "bg-blue-100 text-blue-700",
    fair: "bg-amber-100 text-amber-700",
    worn: "bg-orange-100 text-orange-700",
  };
  return colors[condition] || "bg-gray-100 text-gray-700";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function calculateDiscount(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function resolveImageUrl(path: string): string {
  const value = path?.trim();
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  const uploadPath = normalizedPath.startsWith("/uploads/") ? normalizedPath : `/uploads${normalizedPath}`;

  const host = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!host) {
    return uploadPath;
  }

  return `${host.replace(/\/$/, "")}${uploadPath}`;
}
