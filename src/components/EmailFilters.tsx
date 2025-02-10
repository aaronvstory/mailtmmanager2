import { useState } from "react";
import { useAtom } from "jotai";
import { Plus, Save, Trash2 } from "lucide-react";
import { emailFiltersAtom } from "../lib/store";
import type { EmailFilter } from "../lib/store";

interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

export function EmailFilters() {
  const [filters, setFilters] = useAtom(emailFiltersAtom);
  const [newFilter, setNewFilter] = useState<Partial<EmailFilter>>({
    conditions: [],
    enabled: true,
  });

  const addCondition = () => {
    setNewFilter((prev) => ({
      ...prev,
      conditions: [
        ...(prev.conditions ?? []),
        { field: "subject", operator: "contains", value: "" },
      ],
    }));
  };

  const saveFilter = () => {
    if (!newFilter.name || !newFilter.conditions?.length) return;

    setFilters((prev) => [
      ...prev,
      {
        ...newFilter,
        id: crypto.randomUUID(),
        conditions: newFilter.conditions!,
        action: newFilter.action ?? "mark-read",
      } as EmailFilter,
    ]);

    setNewFilter({ conditions: [], enabled: true });
  };

  const deleteFilter = (id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConditionChange = (
    index: number,
    field: keyof FilterCondition,
    value: string
  ) => {
    const newConditions = [...newFilter.conditions!];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setNewFilter((prev) => ({ ...prev, conditions: newConditions }));
  };

  return (
    <div className="p-4 bg-secondary rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Email Filters</h2>

      {/* Existing Filters */}
      <div className="space-y-4 mb-6">
        {filters.map((filter) => (
          <div
            key={filter.id}
            className="p-3 bg-primary rounded border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{filter.name}</h3>
              <button
                onClick={() => deleteFilter(filter.id)}
                className="p-1 hover:bg-hover rounded"
              >
                <Trash2 className="w-4 h-4 text-secondary" />
              </button>
            </div>
            <div className="space-y-2">
              {filter.conditions.map((condition, i) => (
                <div
                  key={`${filter.id}-condition-${i}`}
                  className="text-sm text-secondary"
                >
                  {condition.field} {condition.operator} "{condition.value}"
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* New Filter Form */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Filter name"
          value={newFilter.name || ""}
          onChange={(e) =>
            setNewFilter((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full p-2 bg-primary border border-border rounded"
        />

        {newFilter.conditions?.map((condition, index) => (
          <div key={index} className="flex gap-2">
            <select
              value={condition.field}
              onChange={(e) =>
                handleConditionChange(index, "field", e.target.value)
              }
              className="p-2 bg-primary border border-border rounded"
            >
              <option value="sender">Sender</option>
              <option value="subject">Subject</option>
              <option value="content">Content</option>
              <option value="date">Date</option>
            </select>

            <select
              value={condition.operator}
              onChange={(e) =>
                handleConditionChange(index, "operator", e.target.value)
              }
              className="p-2 bg-primary border border-border rounded"
            >
              <option value="contains">Contains</option>
              <option value="equals">Equals</option>
              <option value="startsWith">Starts with</option>
              <option value="endsWith">Ends with</option>
              {condition.field === "date" && (
                <>
                  <option value="before">Before</option>
                  <option value="after">After</option>
                </>
              )}
            </select>

            <input
              type={condition.field === "date" ? "date" : "text"}
              value={condition.value}
              onChange={(e) =>
                handleConditionChange(index, "value", e.target.value)
              }
              className="flex-1 p-2 bg-primary border border-border rounded"
            />
          </div>
        ))}

        <div className="flex gap-2">
          <button
            onClick={addCondition}
            className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-hover border border-border rounded"
          >
            <Plus className="w-4 h-4" />
            Add Condition
          </button>

          <button
            onClick={saveFilter}
            disabled={!newFilter.name || !newFilter.conditions?.length}
            className="flex items-center gap-2 px-3 py-2 bg-accent-primary hover:bg-accent-secondary text-primary rounded disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save Filter
          </button>
        </div>
      </div>
    </div>
  );
}
