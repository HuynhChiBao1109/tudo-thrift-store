# Tudo Thrift Store – Second Hand Clothes Store

A full-featured Next.js 14 e-commerce app for a second-hand clothing store, with a complete admin panel.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components (Button, Card, Badge, Dialog, Select, Input...)
- **React Query (TanStack Query v5)** – all data fetching with fake API, ready to swap for real endpoints
- **Recharts** – analytics charts
- **Sonner** – toast notifications

## Features

### Store (Customer-facing)

- 🏠 **Landing page** – hero, features, CTA
- 🛍️ **Product listing** – filter by category, condition, size, price; search; sort
- 📦 **Product detail** – images, condition badge, add to cart
- 🛒 **Cart drawer** – slide-in cart with quantity controls

### Admin Panel

- 📊 **Dashboard** – revenue stats, revenue chart, top products, recent orders
- 📦 **Products** – table with search, add/edit/delete with form dialog
- 🛒 **Orders** – status overview cards, inline status update dropdown
- 👥 **Customers** – customer list with spend summary
- 📈 **Analytics** – bar chart, pie chart, condition distribution

## Getting Started

```bash
# Install dependencies
npm install

# Note: also install tailwindcss-animate
npm install tailwindcss-animate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the store, or [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── store/
│   │   ├── page.tsx          # Product listing
│   │   └── products/[id]/    # Product detail
│   └── admin/
│       ├── page.tsx          # Dashboard
│       ├── products/         # Product management
│       ├── orders/           # Order management
│       ├── customers/        # Customer list
│       └── analytics/        # Charts & analytics
├── components/
│   ├── ui/                   # shadcn/ui base components
│   ├── layout/               # StoreNav, AdminSidebar
│   ├── store/                # ProductCard, CartDrawer, FilterSidebar
│   └── admin/                # ProductForm
├── hooks/
│   ├── useApi.ts             # All React Query hooks
│   └── useCart.tsx           # Cart context
├── lib/
│   ├── api.ts                # Fake API with mock data + delay simulation
│   └── utils.ts              # Formatters, helpers
└── types/
    └── index.ts              # All TypeScript types
```

## Swapping to Real API

All fake API calls are in `lib/api.ts`. Each function follows this pattern:

```typescript
// Current (fake)
export const productsApi = {
  getAll: async (filters?) => {
    await delay(600); // simulate latency
    return { data: mockProducts, total: mockProducts.length };
  },
};

// Replace with (real)
export const productsApi = {
  getAll: async (filters?) => {
    const res = await fetch(`/api/products?${new URLSearchParams(filters)}`);
    return res.json();
  },
};
```

The React Query hooks in `hooks/useApi.ts` don't need any changes.

## Colors

| Name            | Hex       |
| --------------- | --------- |
| Primary (brand) | `#06365b` |
| White           | `#ffffff` |
| Primary Light   | `#3387c7` |
