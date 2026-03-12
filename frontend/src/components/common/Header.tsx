import React, { useState } from 'react';
import { Search, Bell, LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { logout } from '@/features/authSlice';
import { STORAGE_KEYS } from '@/constants';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-20 h-16 border-b border-white/60 bg-[#f9fbfa]/88 backdrop-blur lg:left-64">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-white lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search employees, documents..."
                className="w-full rounded-xl border border-white bg-white/88 py-2 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-white md:hidden">
            <Search size={20} />
          </button>

          <button className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-white">
            <Bell size={20} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-white sm:gap-3 sm:p-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-600 font-medium text-white shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                <p className="max-w-[180px] truncate text-xs text-gray-500">{user?.email || 'admin@company.com'}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/80 bg-white py-1 shadow-[0_28px_60px_-34px_rgba(18,38,31,0.42)]">
                <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  <User size={16} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/70 px-4 py-2 md:hidden">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employees, documents..."
              className="w-full rounded-xl border border-white bg-white/88 py-2 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
