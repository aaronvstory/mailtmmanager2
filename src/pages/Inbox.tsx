import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader, Mail as MailIcon, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { mailTM } from "../lib/api";
import { cn } from "../lib/utils";

export function Inbox() {
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const { data, error } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      setIsMessagesLoading(true);
      try {
        return await mailTM.getMessages();
      } finally {
        setIsMessagesLoading(false);
      }
    },
    refetchInterval: 30000,
  });


  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p className="text-red-500">Failed to load messages</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        {isMessagesLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="divide-y divide-gray-200"> {/* Added container for consistent styling */}
            {data?.messages.map((message) => (
              <button
                key={message.id}
                className="flex items-start justify-between w-full px-4 py-3 hover:bg-gray-100 focus:outline-none" // Added styling to button
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <MailIcon className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium text-primary">
                          {message.from.address}
                        </p>
                        <p className="text-sm text-secondary">
                          {format(new Date(message.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-primary">
                    {message.subject}
                  </h3>
                  <p className="mt-1 text-sm text-secondary line-clamp-2">
                    {message.intro}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        Select a message to view its contents
      </div>
    </div>
  );
}
