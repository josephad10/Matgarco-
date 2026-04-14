import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { orderAPI } from '../../lib/api';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionKey } from '../../lib/permissions';
import { NotificationBell } from '../NotificationPanel';
import SearchBar from '../SearchBar';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart2,
  LogOut,
  Menu,
  X,
  UserRound,
  Palette,
  Wallet,
} from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { can, isOwner } = usePermissions();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  // Fetch pending orders count for badge
  const { data: pendingData } = useQuery({
    queryKey: ['orders-pending-count'],
    queryFn: () => orderAPI.getAll({ status: 'pending', limit: 1 }),
    refetchInterval: 60000, // refresh every 60s
  });
  const pendingCount: number = pendingData?.data?.data?.pagination?.total || 0;

  interface MenuItem {
    name: string;
    path: string;
    icon: React.ElementType;
    badge: number;
    permission?: PermissionKey;
    ownerOnly?: boolean;
  }

  const allMenuItems: MenuItem[] = [
    { name: 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard, badge: 0 },
    { name: 'المنتجات', path: '/dashboard/products', icon: Package, badge: 0, permission: 'products.view' },
    { name: 'الطلبات', path: '/dashboard/orders', icon: ShoppingCart, badge: pendingCount, permission: 'orders.view' },
    { name: 'العملاء', path: '/dashboard/customers', icon: Users, badge: 0, permission: 'customers.view' },
    { name: 'تصميم المتجر', path: '/dashboard/store-design', icon: Palette, badge: 0 },
    { name: 'الماليات', path: '/dashboard/finance', icon: Wallet, badge: 0 },
    { name: 'التقارير', path: '/dashboard/reports', icon: BarChart2, badge: 0, permission: 'reports.view' },
    { name: 'الإعدادات', path: '/dashboard/settings', icon: Settings, badge: 0, permission: 'settings.view' },
    { name: 'الموظفون', path: '/dashboard/staff', icon: UserRound, badge: 0, permission: 'staff.view' as PermissionKey },
  ];

  const menuItems = allMenuItems.filter((item) => {
    if (item.ownerOnly) return isOwner;
    if (!item.permission) return true;
    return can(item.permission);
  });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:flex lg:w-64 lg:flex-col bg-white border-l border-gray-200">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6">
            <img src="/logo.png" alt="Matgarco" className="h-10 w-auto" />
          </div>

          {/* User Info */}
          <div className="mt-8 px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {user?.firstName[0]}{user?.lastName[0]}
                  </span>
                </div>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8 flex-1 px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/dashboard'
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="ml-3 h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge > 0 && (
                    <span className="mr-auto bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 pb-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              <LogOut className="ml-3 h-5 w-5" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 flex flex-col w-64 bg-white">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <img src="/logo.png" alt="Matgarco" className="h-8 w-auto" />
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <nav className="flex-1 px-4 mt-6 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === '/dashboard'
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="ml-3 h-5 w-5 flex-shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {item.badge > 0 && (
                      <span className="mr-auto bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="px-4 pb-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                <LogOut className="ml-3 h-5 w-5" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:mr-64">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Search bar */}
              <SearchBar />

              {/* Notifications */}
              <NotificationBell />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
