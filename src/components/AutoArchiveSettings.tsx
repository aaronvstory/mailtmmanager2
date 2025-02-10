import React from "react";
import { useAtom } from "jotai";
import { autoArchiveDaysAtom } from "../lib/store";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info } from "lucide-react";

export function AutoArchiveSettings() {
  const [autoArchiveDays, setAutoArchiveDays] = useAtom(autoArchiveDaysAtom);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // Ensure value is at least 1 day
    if (isNaN(value) || value < 1) {
      setAutoArchiveDays(1);
      return;
    }
    setAutoArchiveDays(value);
  };

  return (
    <div className="p-4 bg-secondary rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold">Auto Archive</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Emails older than the specified days will be automatically
                archived
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="autoArchiveDays" className="text-sm text-secondary">
          Archive emails after
        </label>
        <Input
          type="number"
          id="autoArchiveDays"
          value={autoArchiveDays}
          onChange={handleChange}
          min={1}
          className="w-20 p-2 bg-primary border border-border rounded text-sm text-primary"
        />
        <span className="text-sm text-secondary">days</span>
      </div>
    </div>
  );
}
