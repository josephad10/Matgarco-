import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MoreVertical, ShieldAlert, CheckCircle2, XCircle, Store, Eye, Loader2, AlertCircle } from 'lucide-react';
import api from '../lib/api';

interface Merchant {
  _id: string;
  storeName: string;
  subdomain: string;
  ownerId: {
    firstName: string;
    lastName: string;
  };
  subscriptionPlan: 'free_trial' | 'starter' | 'professional' | 'business';
  subscriptionStatus: 'active' | 'suspended' | 'cancelled';
  stats: {
    totalRevenue: number;
  };
  createdAt: string;
}

export default function MerchantsList() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        setLoading(true);
        const res = await api.get('/super-admin/merchants');
        setMerchants(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch merchants');
      } finally {
        setLoading(false);
      }
    };
    fetchMerchants();
  }, []);

  const filteredMerchants = merchants.filter(m => {
    const matchesSearch = m.storeName.includes(searchTerm) || m.subdomain.includes(searchTerm) || `${m.ownerId?.firstName} ${m.ownerId?.lastName}`.includes(searchTerm);
    const matchesPlan = filterPlan === 'all' || m.subscriptionPlan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100"><CheckCircle2 size={12}/> نشط</span>;
      case 'suspended': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100"><ShieldAlert size={12}/> موقوف</span>;
      case 'cancelled': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200"><XCircle size={12}/> ملغى</span>;
      default: return null;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'free_trial': return <span className="px-2.5 py-1 rounded w-fit text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">التجربة المجانية</span>;
      case 'starter': return <span className="px-2.5 py-1 rounded w-fit text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">Starter</span>;
      case 'professional': return <span className="px-2.5 py-1 rounded w-fit text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200">Professional</span>;
      case 'business': return <span className="px-2.5 py-1 rounded w-fit text-xs font-bold bg-matgarco-50 text-matgarco-600 border border-matgarco-200">Business</span>;
      default: return null;
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-matgarco-500" size={40} /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl"><AlertCircle /> {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store size={20} />
            </div>
            التجار المتاجر (Merchants)
          </h1>
          <p className="text-slate-500 mt-2 text-sm">أدر كافة المتاجر، راقب حالة الاشتراك، وتحكم في الصلاحيات المركزية.</p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="ابحث برابط المتجر، المالك..." 
              className="pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-matgarco-500 focus:ring-2 focus:ring-matgarco-200 outline-none w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-matgarco-500 focus:ring-2 focus:ring-matgarco-200"
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
          >
            <option value="all">كل الباقات</option>
            <option value="free_trial">التجربة المجانية</option>
            <option value="starter">باقة Starter</option>
            <option value="professional">باقة Professional</option>
            <option value="business">باقة Business</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">المتجر / المالك</th>
                <th className="px-6 py-4 font-bold">الرابط (Subdomain)</th>
                <th className="px-6 py-4 font-bold">الباقة الحالية</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold">إجمالي المبيعات</th>
                <th className="px-6 py-4 font-bold">تاريخ الانضمام</th>
                <th className="px-6 py-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMerchants.map((merchant) => (
                <tr key={merchant._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{merchant.storeName}</div>
                    <div className="text-slate-500 text-xs mt-1">{merchant.ownerId?.firstName} {merchant.ownerId?.lastName}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600 bg-slate-50/30">
                    <a href={`https://${merchant.subdomain}.matgarco.com`} target="_blank" rel="noreferrer" className="hover:text-matgarco-600 hover:underline">
                      {merchant.subdomain}.matgarco.com
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    {getPlanBadge(merchant.subscriptionPlan)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(merchant.subscriptionStatus)}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700 font-mono">
                    {merchant.stats?.totalRevenue?.toLocaleString() || 0} ج.م
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                    {new Date(merchant.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex justify-center items-center gap-2">
                    <Link to={`/merchants/${merchant._id}`} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors" title="عرض التفاصيل">
                      <Eye size={16} />
                    </Link>
                    <button className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredMerchants.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    لا يوجد متاجر مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
          <div>إظهار {filteredMerchants.length} من {merchants.length} متاجر</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100" disabled>السابق</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-100" disabled>التالي</button>
          </div>
        </div>
      </div>
    </div>
  );
}
