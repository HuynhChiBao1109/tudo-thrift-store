"use client";

import { useState } from "react";
import { Edit2, Plus, Tag, Trash2 } from "lucide-react";
import {
  useBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
} from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminBrandsPage() {
  const { data, isLoading } = useBrands();
  const brands = data?.data || [];

  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const [newBrandName, setNewBrandName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const isBusy =
    createBrand.isPending || updateBrand.isPending || deleteBrand.isPending;

  const handleCreate = async () => {
    const name = newBrandName.trim();
    if (!name) return;

    try {
      await createBrand.mutateAsync(name);
      setNewBrandName("");
      toast.success("Brand created");
    } catch {
      toast.error("Failed to create brand");
    }
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = async () => {
    const id = editingId;
    const name = editingName.trim();
    if (!id || !name) return;

    try {
      await updateBrand.mutateAsync({ id, name });
      setEditingId(null);
      setEditingName("");
      toast.success("Brand updated");
    } catch {
      toast.error("Failed to update brand");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete brand \"${name}\"?`)) return;

    try {
      await deleteBrand.mutateAsync(id);
      toast.success("Brand deleted");
    } catch {
      toast.error("Failed to delete brand");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Brands
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {data?.total || 0} brand{(data?.total || 0) !== 1 ? "s" : ""}
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex gap-3">
          <Input
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            placeholder="New brand name"
            className="max-w-md"
          />
          <Button
            onClick={handleCreate}
            disabled={isBusy || !newBrandName.trim()}
          >
            <Plus size={16} className="mr-2" />
            Add Brand
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} className="h-12" />
              ))}
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Tag size={40} className="mx-auto mb-3 opacity-30" />
              <p>No brands yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr className="text-left text-xs text-gray-400 uppercase">
                  <th className="px-6 py-3 font-medium">Brand</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr
                    key={brand.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-3">
                      {editingId === brand.id ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="max-w-md"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {brand.name}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        {editingId === brand.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(null);
                                setEditingName("");
                              }}
                              disabled={isBusy}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleUpdate}
                              disabled={isBusy || !editingName.trim()}
                            >
                              Save
                            </Button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(brand.id, brand.name)}
                              className="p-1.5 text-gray-400 hover:text-[#003966] hover:bg-blue-50 rounded transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(brand.id, brand.name)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
