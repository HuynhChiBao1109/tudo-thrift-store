'use client';

import { useState } from 'react';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useApi';
import { Product, ProductCategory, ProductCondition, ProductSize } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: Product;
  open: boolean;
  onClose: () => void;
}

const defaultForm = {
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  category: 'tops' as ProductCategory,
  condition: 'good' as ProductCondition,
  size: 'M' as ProductSize,
  brand: '',
  images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
  stock: 1,
  featured: false,
  tags: [] as string[],
};

export function ProductForm({ product, open, onClose }: ProductFormProps) {
  const [form, setForm] = useState(product ? {
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice || 0,
    category: product.category,
    condition: product.condition,
    size: product.size,
    brand: product.brand,
    images: product.images,
    stock: product.stock,
    featured: product.featured,
    tags: product.tags,
  } : defaultForm);

  const create = useCreateProduct();
  const update = useUpdateProduct();

  const isEditing = !!product;
  const isPending = create.isPending || update.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await update.mutateAsync({ id: product.id, data: form });
        toast.success('Product updated!');
      } else {
        await create.mutateAsync(form);
        toast.success('Product created!');
      }
      onClose();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const set = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Product Name</Label>
              <Input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Vintage Levi's 501 Jeans"
                required
              />
            </div>

            <div>
              <Label>Brand</Label>
              <Input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Brand name" required />
            </div>

            <div>
              <Label>Stock</Label>
              <Input type="number" min={0} value={form.stock} onChange={e => set('stock', Number(e.target.value))} required />
            </div>

            <div>
              <Label>Price ($)</Label>
              <Input type="number" min={0} step={0.01} value={form.price} onChange={e => set('price', Number(e.target.value))} required />
            </div>

            <div>
              <Label>Original Price ($) <span className="text-gray-400 text-xs">(optional)</span></Label>
              <Input type="number" min={0} step={0.01} value={form.originalPrice} onChange={e => set('originalPrice', Number(e.target.value))} />
            </div>

            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['tops','bottoms','dresses','outerwear','shoes','bags','accessories'] as ProductCategory[]).map(c => (
                    <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Condition</Label>
              <Select value={form.condition} onValueChange={v => set('condition', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="like-new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="worn">Well Worn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Size</Label>
              <Select value={form.size} onValueChange={v => set('size', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['XS','S','M','L','XL','XXL','One Size'] as ProductSize[]).map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={e => set('featured', e.target.checked)}
                className="w-4 h-4 accent-[#06365b]"
              />
              <Label htmlFor="featured">Featured product</Label>
            </div>

            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
                placeholder="Describe the item..."
                required
              />
            </div>

            <div className="col-span-2">
              <Label>Image URL</Label>
              <Input
                value={form.images[0]}
                onChange={e => set('images', [e.target.value])}
                placeholder="https://..."
              />
              {form.images[0] && (
                <img src={form.images[0]} alt="Preview" className="mt-2 h-24 w-20 object-cover rounded-lg" />
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
