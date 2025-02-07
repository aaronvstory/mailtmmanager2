import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Inbox, Star, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { categoriesAtom, pinnedAddressesAtom, authTokenAtom, currentUserAtom } from '../lib/store';
import { mailTM } from '../lib/api';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [categories] = useAtom(categoriesAtom);
  const [pinnedAddresses] = useAtom(pinnedAddressesAtom);
  const [, setToken] = useAtom(authTokenAtom);
  const [, setCurrentUser] = useAtom(currentUserAtom);

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    mailTM.clearToken();
    navigate('/login');
  };

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
          <Inbox className="w-5 h-5 text-secondary" />
          <span>Inbox</span>
        </Link>

        {categories.length > 0 && (
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-secondary uppercase tracking-wider">
              Categories
            </h3>
            <div className="mt-2 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium',
                    location.pathname === `/category/${category.id}`
                      ? 'bg-gray-100 text-primary'
                      : 'text-secondary hover:bg-hover'
                  )}
                >
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {pinnedAddresses.length > 0 && (
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-secondary uppercase tracking-wider">
              Pinned Addresses
            </h3>
            <div className="mt-2 space-y-1">
              {pinnedAddresses.map((address) => (
                <Link
                  key={address}
                  to={`/address/${address}`}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium',
                    location.pathname === `/address/${address}`
                      ? 'bg-gray-100 text-primary'
                      : 'text-secondary hover:bg-hover'
                  )}
                >
                  <Star className="w-4 h-4 text-secondary" />
                  <span>{address}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-8">
          <Link
            to="/settings"
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium',
              location.pathname === '/settings'
                ? 'bg-gray-100 text-primary'
                : 'text-secondary hover:bg-hover'
            )}
          >
            <Settings className="w-5 h-5 text-secondary" />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:bg-gray-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
