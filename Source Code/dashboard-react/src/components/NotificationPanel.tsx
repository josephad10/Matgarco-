import React, { useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ShoppingCart,
  RefreshCw,
  XCircle,
  Package,
  CheckCheck,
  Trash2,
  Loader2,
  BellOff,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { notificationAPI } from '../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Notification {
  _id: string;
  type: 'new_order' | 'order_status_changed' | 'order_cancelled' | 'low_stock' | 'new_customer';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationData {
  notifications: Notification[];
  unreadCount: number;
}

// ─── Icon per type ────────────────────────────────────────────────────────────
const typeIcon: Record<Notification['type'], React.ReactNode> = {
  new_order: <ShoppingCart className="h-4 w-4 text-blue-600" />,
  order_status_changed: <RefreshCw className="h-4 w-4 text-amber-500" />,
  order_cancelled: <XCircle className="h-4 w-4 text-red-500" />,
  low_stock: <Package className="h-4 w-4 text-orange-500" />,
  new_customer: <Bell className="h-4 w-4 text-green-500" />,
};

const typeBg: Record<Notification['type'], string> = {
  new_order: 'bg-blue-100',
  order_status_changed: 'bg-amber-100',
  order_cancelled: 'bg-red-100',
  low_stock: 'bg-orange-100',
  new_customer: 'bg-green-100',
};

// ─── Bell Button (exported for use in DashboardLayout) ───────────────────────
export const NotificationBell: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const { data } = useQuery<NotificationData>({
    queryKey: ['notifications'],
    queryFn: () => notificationAPI.getAll().then((r: any) => r.data.data),
    refetchInterval: 30000, // poll every 30s
  });

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        title={unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : 'الإشعارات'}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </div>
  );
};

// ─── Panel ────────────────────────────────────────────────────────────────────
const NotificationPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<NotificationData>({
    queryKey: ['notifications'],
    queryFn: () => notificationAPI.getAll().then((r: any) => r.data.data),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationAPI.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationAPI.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationAPI.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const handleClick = (n: Notification) => {
    if (!n.isRead) markReadMutation.mutate(n._id);
    if (n.link) {
      navigate(n.link);
      onClose();
    }
  };

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 text-sm">الإشعارات</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50"
          >
            {markAllMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCheck className="h-3.5 w-3.5" />
            )}
            تعيين الكل كمقروء
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <BellOff className="h-10 w-10 mb-2 opacity-40" />
            <p className="text-sm">لا توجد إشعارات</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`group flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                !n.isRead ? 'bg-blue-50/40' : ''
              }`}
            >
              {/* Icon */}
              <button
                onClick={() => handleClick(n)}
                className="flex-1 flex items-start gap-3 text-right min-w-0"
              >
                <div className={`mt-0.5 flex-shrink-0 h-8 w-8 rounded-full ${typeBg[n.type]} flex items-center justify-center`}>
                  {typeIcon[n.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span className="flex-shrink-0 mt-1.5 h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{n.message}</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ar })}
                  </p>
                </div>
              </button>

              {/* Delete button (visible on hover) */}
              <button
                onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(n._id); }}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-500 transition-all mt-0.5"
                title="حذف"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
