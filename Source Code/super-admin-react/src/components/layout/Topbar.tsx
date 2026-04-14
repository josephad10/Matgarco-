import { Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function Topbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 mr-64">
      <div className="flex-1 flex items-center">
        <div className="relative w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="البحث في المنصة بالكامل..." 
            className="w-full pl-4 pr-10 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-matgarco-500 focus:ring-2 focus:ring-matgarco-200 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-left hidden md:block">
            <div className="text-sm font-bold text-slate-900 leading-none mb-1">{user?.name}</div>
            <div className="text-xs text-slate-500 leading-none">{user?.role === 'super_admin' ? 'مدير المنصة' : 'فريق الدعم'}</div>
          </div>
          <button 
            onClick={logout}
            className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
