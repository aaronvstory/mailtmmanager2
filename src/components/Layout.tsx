import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Sidebar } from './Sidebar';
import { AccountSwitcher } from './AccountSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function Layout() {
  return (
    <div className="min-h-screen bg-primary">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <header className="bg-secondary border-b border-border px-4 py-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-primary">Email Management</h1>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <AccountSwitcher />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-primary">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster 
        position="top-right" 
        theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
      />
    </div>
  );
}