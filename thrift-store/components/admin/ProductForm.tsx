"use client";

import { useEffect, useState } from "react";
import { useCreateProduct, useUpdateProduct, useBrands, useUploadProductImages } from "@/hooks/useApi";
import { Product, ProductPayload } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resolveImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { PRODUCT_CATEGORY_OPTIONS } from "@/lib/selectOptions";

interface ProductFormProps {
  product?: Product;
  open: boolean;
  onClose: () => void;
}

const defaultForm = {
  name: "",
  description: "",
  price: 0,
  sale: 0,
  category: "",
  brandId: "",
  images: [] as string[],
};

export function ProductForm({ product, open, onClose }: ProductFormProps) {
  const [form, setForm] = useState(defaultForm);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const create = useCreateProduct();
  const update = useUpdateProduct();
  const uploadImages = useUploadProductImages();
  const { data: brandsResponse } = useBrands();
  const brands = brandsResponse?.data || [];

  const isEditing = !!product;
  const isPending = create.isPending || update.isPending || uploadImages.isPending;

  useEffect(() => {
    if (!open) return;

    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        sale: product.sale || 0,
        category: product.category,
        brandId: product.brandId || "",
        images: product.images || [],
      });
      return;
    }

    setForm(defaultForm);
    setSelectedFiles([]);
  }, [product, open]);

  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please choose image files first");
      return;
    }

    try {
      const uploaded = await uploadImages.mutateAsync(selectedFiles);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...(uploaded.urls || [])],
      }));
      setSelectedFiles([]);
      toast.success("Images uploaded successfully");
    } catch {
      toast.error("Failed to upload images");
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.brandId) {
      toast.error("Please select a brand");
      return;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    const payload: ProductPayload = {
      name: form.name,
      description: form.description,
      price: form.price,
      sale: form.sale,
      category: form.category,
      brandId: form.brandId,
      images: form.images,
    };

    try {
      if (isEditing && product) {
        await update.mutateAsync({ id: product.id, data: payload });
        toast.success("Product updated!");
      } else {
        await create.mutateAsync(payload);
        toast.success("Product created!");
      }
      onClose();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Product Name</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Vintage Levi's 501 Jeans"
                required
              />
              {form.name && (
                <p className="text-xs text-gray-400 mt-1">
                  Slug:{" "}
                  <span className="font-mono text-gray-500">
                    {form.name
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")}
                  </span>
                  {isEditing && product?.slug && <span className="ml-2 text-gray-400">(hiện tại: {product.slug})</span>}
                </p>
              )}
            </div>

            <div>
              <Label>Brand</Label>
              <Select value={form.brandId} onValueChange={(v) => set("brandId", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Giá gốc (VND)</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  step={1000}
                  value={form.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                  className="pr-10"
                  placeholder="e.g. 350000"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                  ₫
                </span>
              </div>
              {form.price > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(form.price)}
                </p>
              )}
            </div>

            <div>
              <Label>Giảm giá (%)</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={form.sale}
                  onChange={(e) => set("sale", Number(e.target.value))}
                  className="pr-8"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
                  %
                </span>
              </div>
              {form.sale > 0 && form.price > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Giá sau:{" "}
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    form.price * (1 - form.sale / 100),
                  )}
                </p>
              )}
            </div>

            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleUploadImages}
                disabled={uploadImages.isPending || selectedFiles.length === 0}
              >
                {uploadImages.isPending ? "Uploading..." : "Upload Images"}
              </Button>
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {form.images.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative group">
                      <img
                        src={resolveImageUrl(image)}
                        alt={`Product ${index + 1}`}
                        className="h-20 w-full rounded-md object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={6}
                className="resize-y min-h-[140px]"
                placeholder="Describe the item... (Enter để xuống hàng)"
                required
              />
              <p className="text-xs text-gray-400 mt-1">{form.description.length} ký tự</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
