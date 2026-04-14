import { useEffect, useState } from 'react';
import { Wallet, CheckCircle, AlertCircle, Building2, ChevronRight, Loader2, X } from 'lucide-react';
import api from '../lib/api';
import clsx from 'clsx';

interface PendingMerchant {
  merchantId: string;
  storeName: string;
  subdomain: string;
  email: string;
  subscriptionPlan: string;
  bankInfo?: { bankName: string; accountNumber: string; accountName: string; iban: string };
  ordersCount: number;
  grossAmount: number;
  paymobFees: number;
  matgarcoCommission: number;
  netAmount: number;
  oldestOrder: string;
  orderIds: string[];
}

interface Payout {
  _id: string;
  merchantId: { storeName: string; email: string };
  periodFrom: string;
  periodTo: string;
  ordersCount: number;
  grossAmount: number;
  paymobFees: number;
  matgarcoCommission: number;
  netAmount: number;
  status: string;
  paidAt?: string;
  transferReference?: string;
  createdAt: string;
}

const PLAN_LABELS: Record<string, string> = {
  free_trial: 'تجربة مجانية', starter: 'Starter', professional: 'Professional', business: 'Business'
};

export default function Payouts() {
  const [tab, setTab] = useState<'pending' | 'history'>('pending');
  const [pending, setPending] = useState<PendingMerchant[]>([]);
  const [history, setHistory] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [modal, setModal] = useState<PendingMerchant | null>(null);
  const [transferRef, setTransferRef] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, historyRes] = await Promise.all([
        api.get('/payouts/pending'),
        api.get('/payouts/history'),
      ]);
      setPending(pendingRes.data.data || []);
      setHistory(historyRes.data.data || []);
    } catch (e: any) {
      setError(e.response?.data?.message || 'فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleProcess = async () => {
    if (!modal) return;
    setProcessing(modal.merchantId);
    try {
      await api.post('/payouts/process', {
        merchantId: modal.merchantId,
        transferReference: transferRef,
        notes,
      });
      setSuccess(`تم تسجيل تسوية ${modal.storeName} بنجاح`);
      setModal(null);
      setTransferRef('');
      setNotes('');
      fetchData();
    } catch (e: any) {
      setError(e.response?.data?.message || 'فشل العملية');
    } finally {
      setProcessing(null);
    }
  };

  const totalPending = pending.reduce((s, m) => s + m.netAmount, 0);
  const totalCommission = pending.reduce((s, m) => s + m.matgarcoCommission, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wallet size={24} />
          </div>
          إدارة التسويات الأسبوعية
        </h1>
        <p className="text-slate-500">مراجعة أرصدة التجار وتحويل مستحقاتهم</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-500 mb-1">إجمالي المعلق للتجار</div>
          <div className="text-2xl font-black text-blue-600">{totalPending.toLocaleString()} ج.م</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-500 mb-1">عمولات Matgarco المحصّلة</div>
          <div className="text-2xl font-black text-emerald-600">{totalCommission.toLocaleString()} ج.م</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="text-xs font-bold text-slate-500 mb-1">تجار بأرصدة معلقة</div>
          <div className="text-2xl font-black text-slate-900">{pending.length}</div>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle size={16} /> {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {(['pending', 'history'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx('px-5 py-2 rounded-lg text-sm font-bold transition-all', tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
          >
            {t === 'pending' ? `أرصدة معلقة (${pending.length})` : 'سجل التسويات'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-500" size={36} /></div>
      ) : tab === 'pending' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-slate-500 font-bold">التاجر</th>
                <th className="px-6 py-4 text-slate-500 font-bold">الباقة</th>
                <th className="px-6 py-4 text-slate-500 font-bold">الطلبات</th>
                <th className="px-6 py-4 text-slate-500 font-bold">إجمالي المبيعات</th>
                <th className="px-6 py-4 text-slate-500 font-bold">رسوم Paymob</th>
                <th className="px-6 py-4 text-slate-500 font-bold">عمولة المنصة</th>
                <th className="px-6 py-4 text-slate-500 font-bold text-blue-600">صافي التاجر</th>
                <th className="px-6 py-4 text-slate-500 font-bold">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pending.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400">لا توجد أرصدة معلقة حالياً</td></tr>
              ) : pending.map((m) => (
                <tr key={m.merchantId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{m.storeName}</div>
                    <div className="text-xs text-slate-400">{m.email}</div>
                    {m.bankInfo?.bankName && (
                      <div className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                        <Building2 size={10} /> {m.bankInfo.bankName}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx('px-2 py-0.5 rounded-full text-xs font-bold',
                      m.subscriptionPlan === 'business' ? 'bg-amber-100 text-amber-800' :
                      m.subscriptionPlan === 'professional' ? 'bg-purple-100 text-purple-800' :
                      m.subscriptionPlan === 'starter' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                    )}>{PLAN_LABELS[m.subscriptionPlan]}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-700">{m.ordersCount}</td>
                  <td className="px-6 py-4 font-mono text-slate-700">{m.grossAmount.toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 font-mono text-rose-600">−{m.paymobFees.toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 font-mono text-emerald-600">−{m.matgarcoCommission.toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 font-black text-blue-600 font-mono">{m.netAmount.toLocaleString()} ج.م</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setModal(m)}
                      disabled={processing === m.merchantId}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                      تسوية <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-slate-500 font-bold">التاجر</th>
                <th className="px-6 py-4 text-slate-500 font-bold">الفترة</th>
                <th className="px-6 py-4 text-slate-500 font-bold">الطلبات</th>
                <th className="px-6 py-4 text-slate-500 font-bold">المبلغ المحوّل</th>
                <th className="px-6 py-4 text-slate-500 font-bold">رقم الإيصال</th>
                <th className="px-6 py-4 text-slate-500 font-bold">الحالة</th>
                <th className="px-6 py-4 text-slate-500 font-bold">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">لا يوجد سجل تسويات بعد</td></tr>
              ) : history.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{p.merchantId?.storeName}</div>
                    <div className="text-xs text-slate-400">{p.merchantId?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                    {new Date(p.periodFrom).toLocaleDateString('ar')} → {new Date(p.periodTo).toLocaleDateString('ar')}
                  </td>
                  <td className="px-6 py-4 font-mono">{p.ordersCount}</td>
                  <td className="px-6 py-4 font-black text-blue-600 font-mono">{p.netAmount.toLocaleString()} ج.م</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{p.transferReference || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={clsx('px-2.5 py-1 rounded-full text-xs font-bold',
                      p.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                      p.status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                    )}>
                      {p.status === 'paid' ? 'محوّل' : p.status === 'failed' ? 'فشل' : 'معلق'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                    {new Date(p.createdAt).toLocaleDateString('ar')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Process Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 mx-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">تسوية: {modal.storeName}</h3>
                <p className="text-sm text-slate-500 mt-0.5">تأكيد تحويل المستحقات</p>
              </div>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600"><span>إجمالي المبيعات</span><span className="font-mono">{modal.grossAmount.toLocaleString()} ج.م</span></div>
              <div className="flex justify-between text-rose-600"><span>رسوم Paymob</span><span className="font-mono">−{modal.paymobFees.toLocaleString()} ج.م</span></div>
              <div className="flex justify-between text-emerald-600"><span>عمولة Matgarco</span><span className="font-mono">−{modal.matgarcoCommission.toLocaleString()} ج.م</span></div>
              <div className="flex justify-between font-black text-blue-700 pt-2 border-t border-slate-200 text-base">
                <span>صافي التاجر</span><span className="font-mono">{modal.netAmount.toLocaleString()} ج.م</span>
              </div>
            </div>

            {/* Bank Info */}
            {modal.bankInfo?.bankName && (
              <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700 space-y-1">
                <div className="font-bold flex items-center gap-1"><Building2 size={12} />{modal.bankInfo.bankName}</div>
                <div>{modal.bankInfo.accountName} — {modal.bankInfo.accountNumber}</div>
                {modal.bankInfo.iban && <div>IBAN: {modal.bankInfo.iban}</div>}
              </div>
            )}

            {/* Transfer Reference */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">رقم إيصال التحويل</label>
              <input
                value={transferRef}
                onChange={(e) => setTransferRef(e.target.value)}
                placeholder="مثال: TXN-20260324-001"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">ملاحظات (اختياري)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleProcess}
                disabled={!!processing}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {processing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                تأكيد التسوية
              </button>
              <button onClick={() => setModal(null)} className="px-5 py-3 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
