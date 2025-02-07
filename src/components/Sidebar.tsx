import React from 'react';
import { Home, Inbox, Archive, Star, Trash2, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export function Sidebar() {
  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
    },
    {
      href: "/inbox",
      icon: Inbox,
      label: "Inbox",
    },
    {
      href: "/archive",
      icon: Archive,
      label: "Archive",
    },
    {
      href: "/starred",
      icon: Star,
      label: "Starred",
    },
    {
      href: "/trash",
      icon: Trash2,
      label: "Trash",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <aside className="bg-secondary w-64 border-r border-border h-full">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-text-primary">Mail.tm</h2>
      </div>
      <nav className="px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) => cn(
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-hover hover:text-text-primary",
              isActive ? 'bg-accent-primary text-text-primary' : 'text-text-secondary'
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
