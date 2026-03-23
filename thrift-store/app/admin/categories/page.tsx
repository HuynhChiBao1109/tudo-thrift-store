"use client";

import { useState } from "react";
import { Edit2, FolderTree, Plus, Trash2 } from "lucide-react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategories();
  const categories = data?.data || [];

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const isBusy = createCategory.isPending || updateCategory.isPending || deleteCategory.isPending;

  const handleCreate = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    try {
      await createCategory.mutateAsync(name);
      setNewCategoryName("");
      toast.success("Category created");
    } catch {
      toast.error("Failed to create category");
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
      await updateCategory.mutateAsync({ id, name });
      setEditingId(null);
      setEditingName("");
      toast.success("Category updated");
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;

    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Categories
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {data?.total || 0} categor{(data?.total || 0) !== 1 ? "ies" : "y"}
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4 flex gap-3">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="max-w-md"
          />
          <Button onClick={handleCreate} disabled={isBusy || !newCategoryName.trim()}>
            <Plus size={16} className="mr-2" />
            Add Category
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
          ) : categories.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FolderTree size={40} className="mx-auto mb-3 opacity-30" />
              <p>No categories yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr className="text-left text-xs text-gray-400 uppercase">
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-3">
                      {editingId === category.id ? (
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="max-w-md"
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{category.name}</p>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        {editingId === category.id ? (
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
                            <Button size="sm" onClick={handleUpdate} disabled={isBusy || !editingName.trim()}>
                              Save
                            </Button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(category.id, category.name)}
                              className="p-1.5 text-gray-400 hover:text-[#003966] hover:bg-blue-50 rounded transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id, category.name)}
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
