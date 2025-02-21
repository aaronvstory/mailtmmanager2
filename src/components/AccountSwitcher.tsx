import React from "react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { activeAccountAtom, storedAccountsAtom } from "../lib/store";
import { mailTM } from "../lib/api";
import { Trash2, Loader } from "lucide-react";

export function AccountSwitcher() {
  const [activeAccountId, setActiveAccountId] = useAtom(activeAccountAtom);
  const [storedAccounts, setStoredAccounts] = useAtom(storedAccountsAtom);
  const [isLoading, setIsLoading] = React.useState(false);

  const activeAccount = React.useMemo(() => {
    return storedAccounts.find((account) => account.id === activeAccountId);
  }, [storedAccounts, activeAccountId]);

  const handleAccountChange = async (accountId: string) => {
    setIsLoading(true);
    try {
      setActiveAccountId(accountId);
      const account = storedAccounts.find((account) => account.id === accountId);
      if (account) {
        mailTM.setToken(account.token);
        toast.success(`Switched to account: ${account.address}`);
      } else {
        toast.error("Account not found");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDelete = (accountId: string) => {
    setStoredAccounts(storedAccounts.filter((account) => account.id !== accountId));
    if (activeAccountId === accountId) {
      setActiveAccountId(null);
    }
    localStorage.setItem("accounts", JSON.stringify(storedAccounts.filter((account) => account.id !== accountId)));
    toast.success("Account deleted");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>Accounts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {storedAccounts.map((account) => (
          <DropdownMenuItem key={account.id} onSelect={() => handleAccountChange(account.id)} className="focus:bg-accent" disabled={isLoading}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">{account.address}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={(e) => {
                e.stopPropagation();
                handleAccountDelete(account.id);
              }} disabled={isLoading}>
                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
