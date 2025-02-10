import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { format } from "date-fns";
import {
  Loader,
  Mail as MailIcon,
  Star,
  Trash2,
  Search,
  Save,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { mailTM } from "../lib/api";
import type { MessageResponse } from "../lib/api";
import {
  categoriesAtom,
  pinnedAddressesAtom,
  selectedMessageIdAtom,
  storedMessagesAtom,
  emailFiltersAtom,
  type Filter,
} from "../lib/store";
import { cn } from "../lib/utils";
import { EmailStorage, type StoredMessage } from "../lib/storage";

export function Inbox() {
  const [selectedId, setSelectedId] = useAtom(selectedMessageIdAtom);
  const [categories] = useAtom(categoriesAtom);
  const [pinnedAddresses, setPinnedAddresses] = useAtom(pinnedAddressesAtom);
  const [storedMessages, setStoredMessages] = useAtom(storedMessagesAtom);
  const [emailFilters] = useAtom(emailFiltersAtom);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false); // Loading state
  const [filterKeyword, setFilterKeyword] = useState(""); // Filter keyword state
  const [searchField, setSearchField] = useState("keyword"); // Search field state

  const applyFilters = (messages: MessageResponse[], filters: Filter[]) => {
    const enabledFilters = filters.filter(filter => filter.enabled);
    if (enabledFilters.length === 0) return messages;
    return messages.filter((message) =>
      enabledFilters.some(filter =>
        filter.conditions.every(condition => {
          const value = condition.value.toLowerCase();
          switch (condition.field) {
            case "sender":
              return message.from.address.toLowerCase().includes(value);
            case "subject":
              return message.subject.toLowerCase().includes(value);
            case "content":
              return message.intro.toLowerCase().includes(value);
            case "date": {
              const messageDate = new Date(message.createdAt);
              const conditionDate = new Date(condition.value);
              return condition.operator === "before"
                ? messageDate < conditionDate
                : messageDate > conditionDate;
            }
            default:
              return false;
          }
        })
      )
    );
  };

  const { data, error, refetch } = useQuery<{ data: MessageResponse[] }>({
    queryKey: ["messages", filterKeyword, searchField], // Include searchField in the query key
    queryFn: async () => {
      setIsMessagesLoading(true); // Set loading to true before fetching
      try {
        const response = await mailTM.getMessages();
        const messages = [...response.data];
        // Apply search filter
        if (filterKeyword) {
          return {
            data: messages.filter((message) => {
              const value = filterKeyword.toLowerCase();
              switch (searchField) {
                case "sender": {
                  return message.from.address.toLowerCase().includes(value);
                }
                case "subject": {
                  return message.subject.toLowerCase().includes(value);
                }
                case "date": {
                  return format(
                    new Date(message.createdAt),
                    "yyyy-MM-dd"
                  ).includes(value);
                }
                default: {
                  const subj = message.subject || "";
                  const intro = message.intro || "";
                  return (
                    subj.toLowerCase().includes(value) ||
                    intro.toLowerCase().includes(value)
                  );
                }
              }
            }),
          };
        }
        // Apply email filters
        return {
          data: applyFilters(messages, emailFilters),
        };
      } finally {
        setIsMessagesLoading(false); // Set loading to false after fetch (success or error)
      }
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });

  const { data: selectedMessage } = useQuery<MessageResponse | null>({
    queryKey: ["message", selectedId],
    queryFn: async () => {
      if (!selectedId) return null;
      const response = await mailTM.getMessage(selectedId);
      return response.data; // Extract the MessageResponse from ApiResponse
    },
    enabled: !!selectedId,
  });

  const handleDelete = async (id: string) => {
    try {
      await mailTM.deleteMessage(id);
      toast.success("Message deleted");
      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    }
  };
  const handleExportToEML = async (message: MessageResponse) => {
    refetch(); // Trigger refetch when the search field changes
  };


  const handleSaveToLocal = async (message: MessageResponse) => {
    try {
      const storedMessage: StoredMessage = {
        id: message.id,
        subject: message.subject,
        intro: message.intro,
        createdAt: message.createdAt,
        from: message.from,
        to: [],
        categoryIds: [],
        archived: false,
        size: 0,
        isDeleted: false,
        downloadUrl: "",
        seen: false,
        updatedAt: new Date().toISOString(),
        accountId: "",
        msgid: "",
        hasAttachments: false,
      };
      await EmailStorage.saveToLocal(storedMessage);
      setStoredMessages([...storedMessages, storedMessage]);
      toast.success("Message saved to local storage");
    } catch (err) {
  const handleExportToEML = async (message: MessageResponse) => {
    try {
      const storedMessage: StoredMessage = {
        id: message.id,
        subject: message.subject,
        intro: message.intro,
        createdAt: message.createdAt,
        from: message.from,
        to: [],
        categoryIds: [],
        archived: false,
    }
  const applyFilters = (messages: MessageResponse[], filters: Filter[]) => {
    const enabledFilters = filters.filter(filter => filter.enabled);
    if (enabledFilters.length === 0) return messages;
    return messages.filter((message) =>
      enabledFilters.some(filter =>
        filter.conditions.every(condition => {
          const value = condition.value.toLowerCase();
          switch (condition.field) {
            case "sender":
              return message.from.address.toLowerCase().includes(value);
            case "subject":
              return message.subject.toLowerCase().includes(value);
            case "content":
              return message.intro.toLowerCase().includes(value);
            case "date": {
              const messageDate = new Date(message.createdAt);
              const conditionDate = new Date(condition.value);
              return condition.operator === "before"
                ? messageDate < conditionDate
                : messageDate > conditionDate;
            }
            default:
              return false;
          }
        })
      )
    );
  };
  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-error">
        <p className="text-error">Failed to load messages</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r border-border overflow-y-auto">
        {/* Filter Input */}
        <div className="p-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Filter messages..."
                className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={filterKeyword}
                onChange={handleFilterChange}
              />
            </div>
            <select
              onChange={handleSearchFieldChange}
              value={searchField}
              className="p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="keyword">Keyword</option>
              <option value="sender">Sender</option>
              <option value="subject">Subject</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>

        {isMessagesLoading ? ( // Use isMessagesLoading state
          <div className="flex items-center justify-center h-32">
            <Loader className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {data?.data.map((message: MessageResponse) => {
              const messageCategories = categories.filter((category) =>
                category.keywords.some(
                  (keyword) =>
                    message.subject
                      .toLowerCase()
                      .includes(keyword.toLowerCase()) ||
                    message.intro.toLowerCase().includes(keyword.toLowerCase())
                )
              );

              return (
                <div
                  key={message.id}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-gray-50 w-full text-left",
                    selectedId === message.id && "bg-gray-100"
                  )}
                  onClick={() => setSelectedId(message.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <MailIcon
                        className={cn(
                          "w-5 h-5 text-secondary",
                          message.seen ? "text-gray-400" : "text-blue-500"
                        )}
                      />
                      <div>
                        <p className="font-medium text-primary">
                          {message.from.address}
                        </p>
                        <p className="text-sm text-secondary">
                          {format(new Date(message.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveToLocal(message);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Save className="w-4 h-4 text-secondary" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportToEML(message);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Download className="w-4 h-4 text-secondary" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePinned(message.from.address);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Star
                          className={cn(
                            "w-4 h-4",
                            pinnedAddresses.includes(message.from.address)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-400"
                          )}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        <Trash2 className="w-4 h-4 text-secondary" />
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-primary">
                    {message.subject}
                  </h3>
                  <p className="mt-1 text-sm text-secondary line-clamp-2">
                    {message.intro}
                  </p>
                  {messageCategories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {messageCategories.map((category) => (
                        <span
                          key={category.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="w-2/3 p-6 overflow-y-auto">
        {selectedMessage ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">
                {selectedMessage.subject}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => togglePinned(selectedMessage.from.address)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Star
                    className={cn(
                      "w-5 h-5",
                      pinnedAddresses.includes(selectedMessage.from.address)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-400"
                    )}
                  />
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Trash2 className="w-5 h-5 text-secondary" />
                </button>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-secondary">
                From:{" "}
                <span className="font-medium text-primary">
                  {selectedMessage.from.address}
                </span>
              </p>
              <p className="text-sm text-secondary">
                Date:{" "}
                <span className="font-medium text-primary">
                  {format(new Date(selectedMessage.createdAt), "PPpp")}
                </span>
              </p>
              <div className="prose max-w-none">
                <p>{selectedMessage.intro}</p>
              </div>
            </div>
            <button
              onClick={() => handleExportToEML(selectedMessage)}
              className="flex items-center gap-2 px-3 py-2 bg-accent-primary hover:bg-accent-secondary text-primary rounded"
            >
              <Download className="w-4 h-4" />
              Export to EML
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-secondary">
            Select a message to view its contents
          </div>
        )}
      </div>
    </div>
  );
}
