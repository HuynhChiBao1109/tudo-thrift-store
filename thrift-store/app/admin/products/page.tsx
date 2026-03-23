"use client";

import { useState } from "react";
import { useProducts, useDeleteProduct } from "@/hooks/useApi";
import { Product } from "@/types";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Edit2, Trash2, Star } from "lucide-react";
import { formatPrice, getConditionLabel, getConditionColor, resolveImageUrl, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();

  const { data, isLoading } = useProducts({ search: search || undefined });
  const products = data?.data || [];
  const deleteProduct = useDeleteProduct();

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setFormOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleClose = () => {
    setFormOpen(false);
    setEditProduct(undefined);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Products
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{data?.total || 0} items listed</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} className="mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="pl-9 max-w-md"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr className="text-left text-xs text-gray-400 uppercase">
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Condition</th>
                  <th className="px-6 py-3 font-medium">Size</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Sale</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-10 h-12 object-cover rounded-md"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-gray-900 truncate max-w-[180px]">{product.name}</p>
                            {product.featured && <Star size={12} className="text-amber-400 fill-amber-400 shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{product.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-medium",
                          getConditionColor(product.condition),
                        )}
                      >
                        {getConditionLabel(product.condition)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.size}</td>
                    <td className="px-6 py-4 font-semibold text-[#003966]">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 text-gray-600">{product.sale || 0}%</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn("text-xs font-medium", product.stock === 0 ? "text-red-500" : "text-gray-700")}
                      >
                        {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-gray-400 hover:text-[#003966] hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <ProductForm product={editProduct} open={formOpen} onClose={handleClose} />
    </div>
  );
}
