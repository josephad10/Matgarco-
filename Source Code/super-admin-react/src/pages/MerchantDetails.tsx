import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, Store, ShieldAlert, CheckCircle2, 
  XCircle, Users, CreditCard,
  Package, Activity, Loader2, AlertCircle, Eye
} from 'lucide-react';
import api from '../lib/api';

export default function MerchantDetails() {
  const { id } = useParams();
  
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/super-admin/merchants/${id}`);
        setMerchant(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch merchant details');
      } finally {
        setLoading(false);
      }
    };
    fetchMerchant();
  }, [id]);

  const handleImpersonate = async () => {
    try {
      const res = await api.post(`/super-admin/impersonate/${id}`);
      window.open(res.data.data.redirectUrl, '_blank');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to impersonate merchant');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold"><CheckCircle2 size={16} /> نشط</span>;
      case 'suspended': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-bold"><ShieldAlert size={16} /> موقوف</span>;
      case 'cancelled': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-bold"><XCircle size={16} /> ملغي</span>;
      default: return null;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'business': return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-sm font-bold border border-amber-200">الأعمال (القمة)</span>;
      case 'professional': return <span className="px-3 py-1 bg-matgarco-100 text-matgarco-800 rounded-lg text-sm font-bold border border-matgarco-200">الاحترافية (انطلاق)</span>;
      case 'starter': return <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-200">الأساسية (خطوة)</span>;
      case 'free_trial': return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold border border-slate-200">تجربة مجانية</span>;
      default: return null;
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-matgarco-500" size={40} /></div>;
  if (error || !merchant) return <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle /> {error || 'Merchant not found'}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/merchants" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-sm">
          <ArrowRight size={20} />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-900">{merchant.storeName}</h1>
          <a href={`https://${merchant.subdomain}.matgarco.com`} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-matgarco-600 transition-colors mt-1 font-mono" dir="ltr">
            {merchant.subdomain}.matgarco.com
          </a>
        </div>
      </div>
      <div className="flex gap-3">
        {getStatusBadge(merchant.subscriptionStatus)}
        {getPlanBadge(merchant.subscriptionPlan)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Store size={18} className="text-slate-400"/> بيانات المتجر الأساسية</h2>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <dt className="text-sm text-slate-500">اسم المالك</dt>
                <dd className="font-bold text-slate-900">{merchant.ownerId?.firstName} {merchant.ownerId?.lastName}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">البريد الإلكتروني</dt>
                <dd className="font-bold text-slate-900 font-mono text-sm">{merchant.ownerId?.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">رقم الهاتف</dt>
                <dd className="font-bold text-slate-900 font-mono text-sm" dir="ltr">{merchant.phone || merchant.ownerId?.phone || 'غير متوفر'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">تاريخ الانضمام</dt>
                <dd className="font-bold text-slate-900 font-mono text-sm">{new Date(merchant.createdAt).toLocaleDateString()}</dd>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Activity size={18} className="text-slate-400"/> إحصائيات الاستخدام</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3"><Package size={16}/></div>
                <div className="text-2xl font-black text-slate-900">{merchant.stats?.totalProducts?.toLocaleString() || 0}</div>
                <div className="text-sm font-medium text-slate-500">منتج مفعل</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3"><CreditCard size={16}/></div>
                <div className="text-2xl font-black text-slate-900">{merchant.stats?.totalOrders?.toLocaleString() || 0}</div>
                <div className="text-sm font-medium text-slate-500">طلب مكتمل</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3"><Users size={16}/></div>
                <div className="text-2xl font-black text-slate-900">{merchant.stats?.totalCustomers?.toLocaleString() || 0}</div>
                <div className="text-sm font-medium text-slate-500">عميل مسجل</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">تفاصيل الاشتراك</h2>
            <div className="flex items-center justify-between p-4 rounded-xl bg-matgarco-50 border border-matgarco-100 mb-4">
              <div>
                <div className="text-sm text-matgarco-600 font-bold mb-1">الباقة الحالية</div>
                <div className="text-xl font-black text-matgarco-900">{getPlanBadge(merchant.subscriptionPlan) || merchant.subscriptionPlan}</div>
              </div>
              <div className="text-left font-mono text-sm text-matgarco-700 font-bold bg-white px-3 py-1.5 rounded-lg border border-matgarco-200">
                {({free_trial:0, starter:250, professional:450, business:699} as Record<string,number>)[merchant.subscriptionPlan] || 0} EGP / mo
              </div>
            </div>
            <div className="space-y-3 pb-4 mb-4 border-b border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">الحالة</span>
                <span>{getStatusBadge(merchant.subscriptionStatus)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">إجمالي المبيعات</span>
                <span className="font-bold text-emerald-600 font-mono">{(merchant.stats?.totalRevenue || 0).toLocaleString()} ج.م</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-red-900 mb-2 flex items-center gap-2"><ShieldAlert size={18}/> منطقة الخطر (God Mode)</h2>
            <p className="text-red-700/80 text-sm mb-6 leading-relaxed">تحذير: الإجراءات هنا تؤثر مباشرة على المتجر للعملاء والتاجر.</p>
            
            <div className="space-y-3">
              <button 
                onClick={handleImpersonate}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-red-200 text-slate-900 font-bold rounded-xl hover:bg-red-100 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3"><Eye size={18} className="text-slate-400" /> دخول כتاجر</div>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20">
                <div className="flex items-center gap-3">إيقاف المتجر (Suspend)</div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
