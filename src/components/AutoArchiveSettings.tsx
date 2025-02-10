import React from 'react';
import { useAtom } from 'jotai';
import { autoArchiveDaysAtom } from '../lib/store';

export function AutoArchiveSettings() {
  const [autoArchiveDays, setAutoArchiveDays] = useAtom(autoArchiveDaysAtom);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setAutoArchiveDays(value);
  };

  return (
    <div className="p-4 bg-secondary rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Auto Archive</h2>
      <div className="flex items-center space-x-2">
        <label htmlFor="autoArchiveDays" className="text-sm text-secondary">
          Archive emails after
        </label>
        <input
          type="number"
          id="autoArchiveDays"
          value={autoArchiveDays}
          onChange={handleChange}
          className="w-20 p-2 bg-primary border border-border rounded text-sm text-primary"
        />
        <span className="text-sm text-secondary">days</span>
      </div>
    </div>
  );
}
