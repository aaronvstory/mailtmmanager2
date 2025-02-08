import React from 'react';
import { useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { LogIn, ChevronDown } from 'lucide-react';
import { storedAccountsAtom, activeAccountAtom, authTokenAtom } from '../lib/store';
import { mailTM } from '../lib/api';
import { cn } from '../lib/utils';

export function AccountSwitcher() {
  const navigate = useNavigate();
  const [storedAccounts] = useAtom(storedAccountsAtom);
  const [activeAccountId, setActiveAccountId] = useAtom(activeAccountAtom);
  const [, setAuthToken] = useAtom(authTokenAtom);
  const [isSwitchingAccount, setIsSwitchingAccount] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const activeAccount = storedAccounts.find(account => account.id === activeAccountId);

  const handleAccountChange = async (accountId: string) => {
    setIsSwitchingAccount(true);
    const newAccount = storedAccounts.find(account => account.id === accountId);
    if (!newAccount) return;

    try {
      // Set the token in the API client
      mailTM.setToken(newAccount.token);

      // Update auth state
      setAuthToken(newAccount.token);
      setActiveAccountId(newAccount.id);

      // Close dropdown
      setIsOpen(false);

      // Force reload inbox data
      window.location.reload();
    } finally {
      setIsSwitchingAccount(false);
    }
  };

  return (
    <div className="relative">
      <button
        disabled={isSwitchingAccount}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-secondary hover:bg-hover border border-border rounded-lg transition-colors"
      >
        {activeAccount ? (
          <>
            <span className="text-primary">{activeAccount.email}</span>
            <ChevronDown className="w-4 h-4 text-secondary" />
          </>
        ) : (
          <span className="text-secondary">Select Account</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right bg-secondary border border-border rounded-lg shadow-lg">
          <div className="py-1">
            {storedAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleAccountChange(account.id)}
                className={cn(
                  'block w-full px-4 py-2 text-sm text-left transition-colors',
                  account.id === activeAccountId
                    ? 'bg-hover text-primary'
                    : 'text-secondary hover:bg-hover'
                )}
              >
                {account.email}
              </button>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/login');
              }}
              className="flex items-center w-full gap-2 px-4 py-2 text-sm text-secondary hover:bg-hover transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Add Account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
