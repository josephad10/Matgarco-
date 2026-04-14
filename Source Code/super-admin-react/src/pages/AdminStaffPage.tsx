import { useState, useEffect } from 'react';
import { Users, Loader2, AlertCircle, Plus, Trash2, Shield, X, Save, User, ShieldAlert, Wallet, Headphones, Code2 } from 'lucide-react';
import clsx from 'clsx';
import api from '../lib/api';

const ROLE_MAP: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  super_admin: { label: 'مدير عام', color: 'text-red-700', bg: 'bg-red-50', icon: ShieldAlert },
  finance_manager: { label: 'مدير مالي', color: 'text-emerald-700', bg: 'bg-emerald-50', icon: Wallet },
  support_agent: { label: 'وكيل دعم', color: 'text-blue-700', bg: 'bg-blue-50', icon: Headphones },
  theme_developer: { label: 'مطور قوالب', color: 'text-purple-700', bg: 'bg-purple-50', icon: Code2 }
};

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', adminRole: 'support_agent' });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/staff');
      setStaff(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAdd = async () => {
    if (!form.firstName || !form.email || !form.password) return alert('أكمل البيانات المطلوبة');
    setSaving(true);
    try {
      await api.post('/super-admin/staff', form);
      setShowAdd(false);
      setForm({ firstName: '', lastName: '', email: '', password: '', adminRole: 'support_agent' });
      fetchStaff();
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل إضافة الموظف');
    } finally { setSaving(false); }
  };

  const handleRoleChange = async (id: string, adminRole: string) => {
    try {
      await api.patch(`/super-admin/staff/${id}`, { adminRole });
      setStaff(staff.map(s => s._id === id ? { ...s, adminRole } : s));
    } catch { alert('فشل تحديث الدور'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;
    try {
      await api.delete(`/super-admin/staff/${id}`);
      setStaff(staff.filter(s => s._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل حذف الموظف');
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-matgarco-500" size={40} /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle /> {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Shield size={24} /></div>
            فريق الإدارة
          </h1>
          <p className="text-slate-500">إدارة الموظفين والأدوار في لوحة الإدارة العليا.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-matgarco-600 hover:bg-matgarco-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-md shadow-matgarco-600/20">
          <Plus size={18} /> إضافة موظف
        </button>
      </div>

      {/* Role Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(ROLE_MAP).map(([key, role]) => (
          <div key={key} className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold", role.bg, role.color)}>
            <role.icon size={14} /> {role.label}
          </div>
        ))}
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {staff.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p>لا يوجد موظفين إدارة</p>
          </div>
        ) : (
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">الموظف</th>
                <th className="px-6 py-4 font-bold">البريد الإلكتروني</th>
                <th className="px-6 py-4 font-bold">الدور</th>
                <th className="px-6 py-4 font-bold">تاريخ الإنشاء</th>
                <th className="px-6 py-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map(member => {
                const role = ROLE_MAP[member.adminRole] || ROLE_MAP.support_agent;
                return (
                  <tr key={member._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          <User size={18} />
                        </div>
                        <div className="font-bold text-slate-900">{member.firstName} {member.lastName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs" dir="ltr">{member.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={member.adminRole || 'super_admin'}
                        onChange={e => handleRoleChange(member._id, e.target.value)}
                        className={clsx("px-3 py-1.5 rounded-lg text-xs font-bold border outline-none", role.bg, role.color)}
                      >
                        {Object.entries(ROLE_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{member.createdAt ? new Date(member.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDelete(member._id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors mx-auto" title="حذف">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">إضافة موظف جديد</h3>
              <button onClick={() => setShowAdd(false)} className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الاسم الأول</label>
                  <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-matgarco-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الاسم الأخير</label>
                  <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-matgarco-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} dir="ltr" className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-matgarco-500 text-left font-mono" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">كلمة المرور</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} dir="ltr" className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-matgarco-500 text-left font-mono" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">الدور</label>
                <select value={form.adminRole} onChange={e => setForm({ ...form, adminRole: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-matgarco-500">
                  {Object.entries(ROLE_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <button onClick={handleAdd} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-matgarco-600 hover:bg-matgarco-700 text-white py-3 rounded-xl font-bold transition-colors disabled:bg-slate-400">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} إضافة الموظف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
