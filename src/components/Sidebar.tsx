import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-secondary border-r border-border p-4">
      <div className="space-y-1">
        <Link
          to="/"
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium',
            location.pathname === '/' ? 'bg-gray-100 text-primary' : 'text-secondary hover:bg-hover'
          )}
        >
          <Inbox className="w-5 h-5" /> {/* Removed redundant text-secondary */}
          <span>Inbox</span>
        </Link>
      </div>
    </div>
  );
}
