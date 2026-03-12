import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  FileText,
  FilePlus,
  FolderOpen,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { APP_NAME, APP_DESCRIPTION, ROUTES } from '@/constants';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
  { icon: Users, label: 'Employees', path: ROUTES.EMPLOYEES },
  { icon: Building2, label: 'Departments', path: ROUTES.DEPARTMENTS },
  { icon: DollarSign, label: 'Salary / Payroll', path: ROUTES.PAYROLL },
  { icon: FileText, label: 'Document Templates', path: ROUTES.TEMPLATES },
  { icon: FilePlus, label: 'Generate Document', path: ROUTES.GENERATE_DOCUMENT },
  { icon: FolderOpen, label: 'Documents History', path: ROUTES.DOCUMENTS },
  { icon: Settings, label: 'Settings', path: ROUTES.SETTINGS },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-slate-950/40 transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen w-[17.5rem] flex-col border-r border-white/60 bg-[#f9fbfa]/92 shadow-[0_28px_60px_-34px_rgba(18,38,31,0.42)] backdrop-blur transition-transform duration-300 lg:w-64 lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-start justify-between border-b border-gray-200/70 px-5 py-5 sm:px-6">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-primary-700 sm:text-xl">{APP_NAME}</h1>
            <p className="mt-1 text-xs text-gray-500">{APP_DESCRIPTION}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 sm:px-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-white'
                )
              }
            >
              <item.icon size={20} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
