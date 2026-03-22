import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  productsApi,
  ordersApi,
  customersApi,
  dashboardApi,
  brandsApi,
  authApi,
  uploadsApi,
} from "@/lib/api";
import { Product, ProductFilters, Order, ProductPayload } from "@/types";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const queryKeys = {
  products: (filters?: ProductFilters) => ["products", filters] as const,
  product: (id: string) => ["product", id] as const,
  orders: () => ["orders"] as const,
  order: (id: string) => ["order", id] as const,
  customers: () => ["customers"] as const,
  customer: (id: string) => ["customer", id] as const,
  dashboard: () => ["dashboard"] as const,
  brands: () => ["brands"] as const,
};

// ─── Product Hooks ────────────────────────────────────────────────────────────

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => productsApi.getAll(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductPayload) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductPayload> }) =>
      productsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.product(id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ─── Order Hooks ──────────────────────────────────────────────────────────────

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders(),
    queryFn: () => ordersApi.getAll(),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order["status"] }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders() });
    },
  });
}

// ─── Customer Hooks ───────────────────────────────────────────────────────────

export function useCustomers() {
  return useQuery({
    queryKey: queryKeys.customers(),
    queryFn: () => customersApi.getAll(),
  });
}

export function useBrands() {
  return useQuery({
    queryKey: queryKeys.brands(),
    queryFn: () => brandsApi.getAll(),
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => brandsApi.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands() });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      brandsApi.update(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands() });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => brandsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands() });
    },
  });
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => authApi.login(username, password),
  });
}

export function useUploadProductImages() {
  return useMutation({
    mutationFn: (files: File[]) => uploadsApi.uploadProductImages(files),
  });
}

// ─── Dashboard Hooks ──────────────────────────────────────────────────────────

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: () => dashboardApi.getStats(),
  });
}
