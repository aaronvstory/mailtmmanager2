import { useState } from "react";
import { useAtom } from "jotai";
import { Plus, Save, Trash2 } from "lucide-react";
import { categoriesAtom } from "../lib/store";
import type { Category } from "../lib/store";

export function CategoryManager() {
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    keywords: [],
  });

  const addKeyword = () => {
    setNewCategory((prev) => ({
      ...prev,
      keywords: [...(prev.keywords ?? []), ""],
    }));
  };

  const saveCategory = () => {
    if (!newCategory.name) return;

    setCategories((prev) => [
      ...prev,
      {
        ...newCategory,
        id: crypto.randomUUID(),
        keywords: newCategory.keywords ?? [],
      } as Category,
    ]);

    setNewCategory({ keywords: [] });
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...(newCategory.keywords ?? [])];
    newKeywords[index] = value;
    setNewCategory((prev) => ({ ...prev, keywords: newKeywords }));
  };

  return (
    <div className="p-4 bg-secondary rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Category Manager</h2>

      <div className="space-y-4 mb-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-3 bg-primary rounded border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{category.name}</h3>
              <button
                onClick={() => deleteCategory(category.id)}
                className="p-1 hover:bg-hover rounded"
              >
                <Trash2 className="w-4 h-4 text-secondary" />
              </button>
            </div>
            <div className="space-y-2">
              {category.keywords.map((keyword, i) => (
                <div
                  key={`${category.id}-keyword-${i}`}
                  className="text-sm text-secondary"
                >
                  {keyword}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Category name"
          value={newCategory.name ?? ""}
          onChange={(e) =>
            setNewCategory((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full p-2 bg-primary border border-border rounded"
        />

        {newCategory.keywords?.map((keyword, index) => (
          <input
            key={`new-keyword-${index}`}
            type="text"
            value={keyword}
            onChange={(e) => handleKeywordChange(index, e.target.value)}
            placeholder="Keyword"
            className="w-full p-2 bg-primary border border-border rounded"
          />
        ))}

        <div className="flex gap-2">
          <button
            onClick={addKeyword}
            className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-hover border border-border rounded"
          >
            <Plus className="w-4 h-4" />
            Add Keyword
          </button>

          <button
            onClick={saveCategory}
            disabled={!newCategory.name}
            className="flex items-center gap-2 px-3 py-2 bg-accent-primary hover:bg-accent-secondary text-primary rounded disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Category
          </button>
        </div>
      </div>
    </div>
  );
}
