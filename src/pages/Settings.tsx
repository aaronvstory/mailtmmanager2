import { AutoArchiveSettings } from "../components/AutoArchiveSettings";
import { Button } from "../components/ui/button";
import { EmailStorage } from "../lib/storage";
import { toast } from "sonner";
import { storedMessagesAtom } from "../lib/store";
import { useAtom } from "jotai";

export function Settings() {
  const [, setStoredMessages] = useAtom(storedMessagesAtom);

  const handleCleanupLocalStorage = async () => {
    try {
      await EmailStorage.cleanup();
      setStoredMessages([]); // Clear the stored messages atom
      toast.success("Local storage cleaned up");
    } catch (err) {
      console.error("Failed to cleanup local storage:", err);
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
