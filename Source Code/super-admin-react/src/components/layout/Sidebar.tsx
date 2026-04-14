import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  CreditCard, 
  Palette, 
  Settings, 
  Users,
  LifeBuoy,
  Wallet,
  Package
} from 'lucide-react';
import { cn } from '../../lib/utils'; // We need to create this

export function Sidebar() {
  const menuItems = [
    { name: 'الرئيسية', icon: LayoutDashboard, path: '/' },
    { name: 'التجار والمتاجر', icon: Store, path: '/merchants' },
    { name: 'الماليات والاشتراكات', icon: CreditCard, path: '/finance' },
    { name: 'التسويات الأسبوعية', icon: Wallet, path: '/payouts' },
    { name: 'باقات الاشتراك', icon: Package, path: '/plans' },
    { name: 'القوالب والثيمات', icon: Palette, path: '/themes' },
    { name: 'الدعم الفني', icon: LifeBuoy, path: '/support' },
    { name: 'الإعدادات العامة', icon: Settings, path: '/settings' },
    { name: 'فريق الإدارة', icon: Users, path: '/staff' },
  ];

  return (
    <aside className="fixed right-0 top-0 bottom-0 w-64 bg-slate-950 text-slate-300 flex flex-col z-40 transition-transform duration-300">
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-extrabold text-xl py-4">
          <div className="w-8 h-8 rounded-lg bg-matgarco-500 flex items-center justify-center">
            <span className="text-white text-lg">M</span>
          </div>
          <span>Matgarco Admin</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                  isActive 
                    ? "bg-matgarco-500/10 text-matgarco-400" 
                    : "hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
