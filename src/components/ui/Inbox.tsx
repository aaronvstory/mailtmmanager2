import { toast } from "sonner";
import type { MessageResponse } from "../../lib/api";
import { storedMessagesAtom } from "../../lib/store";
import { useAtom } from "jotai";
import { EmailStorage } from "../../lib/emailStorage";
import type { StoredMessage } from "../../lib/store";

const Inbox = () => {
  const [storedMessages, setStoredMessages] = useAtom(storedMessagesAtom);

  const handleSaveToLocal = async (message: MessageResponse) => {
    try {
      const storedMessage: StoredMessage = {
        ...message,
        categoryIds: [],
        archived: false,
        size: 0,
        isDeleted: false,
        downloadUrl: "",
        seen: false,
      };
      await EmailStorage.saveToLocal(storedMessage);
      setStoredMessages((prev: StoredMessage[]) => [...prev, storedMessage]);
      toast.success("Message saved to local storage");
    } catch (error) {
      console.error("Failed to save message:", error);
      toast.error("Failed to save message to local storage");
    }
  };

  return (
    <div>
      <h2>Inbox</h2>
      <button
        onClick={() => {
          // Example: simulate saving a dummy message
          const dummyMessage = { id: "1" } as MessageResponse;
          handleSaveToLocal(dummyMessage);
        }}
      >
        Save Dummy Message
      </button>
      <ul>
        {storedMessages.map((msg: StoredMessage) => (
          <li key={msg.id}>{msg.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default Inbox;
