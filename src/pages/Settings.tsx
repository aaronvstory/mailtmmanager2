import React from 'react';
import { AutoArchiveSettings } from '../components/AutoArchiveSettings';
import { Button } from '../components/ui/button';
import { EmailStorage } from '../lib/storage';
import { toast } from 'sonner';

export function Settings() {
  const handleCleanupLocalStorage = async () => {
    try {
      await EmailStorage.cleanup();
      toast.success("Local storage cleaned up");
    } catch (error) {
      toast.error("Failed to cleanup local storage");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <AutoArchiveSettings />
      <Button onClick={handleCleanupLocalStorage} className="mt-4">
        Cleanup Local Storage
      </Button>
    </div>
  );
}
