import { useState, useEffect } from 'react';
import { LifeBuoy, Loader2, AlertCircle, Send, X, User, Store, CreditCard, Wrench, Truck, ClipboardList } from 'lucide-react';
import clsx from 'clsx';
import api from '../lib/api';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: 'مفتوحة', color: 'text-blue-700', bg: 'bg-blue-50' },
  in_progress: { label: 'قيد المعالجة', color: 'text-amber-700', bg: 'bg-amber-50' },
  resolved: { label: 'تم الحل', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  closed: { label: 'مغلقة', color: 'text-slate-700', bg: 'bg-slate-100' }
};

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  low: { label: 'منخفضة', color: 'text-slate-500' },
  medium: { label: 'متوسطة', color: 'text-blue-600' },
  high: { label: 'عالية', color: 'text-amber-600' },
  urgent: { label: 'عاجلة', color: 'text-red-600' }
};

const CATEGORY_ICONS: Record<string, any> = {
  billing: CreditCard,
  technical: Wrench,
  shipping: Truck,
  general: ClipboardList
};

const CATEGORY_LABELS: Record<string, string> = {
  billing: 'فواتير',
  technical: 'تقني',
  shipping: 'شحن',
  general: 'عام'
};

export default function SupportCenter() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replying, setReplying] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/tickets', { params: { status: filterStatus } });
      setTickets(res.data.data || []);
      setStats(res.data.stats || {});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [filterStatus]);

  const handleReply = async () => {
    if (!replyContent.trim() || !selectedTicket) return;
    setReplying(true);
    try {
      const res = await api.post(`/super-admin/tickets/${selectedTicket._id}/reply`, { content: replyContent });
      setSelectedTicket(res.data.data);
      setReplyContent('');
      fetchTickets();
    } catch { alert('فشل إرسال الرد'); }
    finally { setReplying(false); }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await api.patch(`/super-admin/tickets/${ticketId}/status`, { status: newStatus });
      if (selectedTicket?._id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
      fetchTickets();
    } catch { alert('فشل تحديث الحالة'); }
  };

  const openTicket = async (ticket: any) => {
    try {
      const res = await api.get(`/super-admin/tickets/${ticket._id}`);
      setSelectedTicket(res.data.data);
    } catch { setSelectedTicket(ticket); }
  };

  if (loading && tickets.length === 0) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-matgarco-500" size={40} /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle /> {error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center"><LifeBuoy size={24} /></div>
          مركز الدعم الفني
        </h1>
        <p className="text-slate-500">إدارة تذاكر الدعم والرد على استفسارات التجار.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'مفتوحة', value: stats.open || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'قيد المعالجة', value: stats.in_progress || 0, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'تم الحل', value: stats.resolved || 0, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'مغلقة', value: stats.closed || 0, color: 'text-slate-600', bg: 'bg-slate-50' }
        ].map((s, i) => (
          <div key={i} className={clsx("rounded-2xl border border-slate-200 p-4 text-center", s.bg)}>
            <div className={clsx("text-2xl font-black", s.color)}>{s.value}</div>
            <div className="text-sm text-slate-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={clsx(
            "px-4 py-2 rounded-xl text-sm font-bold transition-colors",
            filterStatus === s ? 'bg-matgarco-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          )}>
            {s === 'all' ? 'الكل' : STATUS_MAP[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {tickets.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <LifeBuoy size={40} className="mx-auto mb-3 opacity-40" />
            <p>لا توجد تذاكر دعم حتى الآن</p>
          </div>
        ) : (
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-5 py-3.5 font-bold">الموضوع</th>
                <th className="px-5 py-3.5 font-bold">المتجر</th>
                <th className="px-5 py-3.5 font-bold">الفئة</th>
                <th className="px-5 py-3.5 font-bold">الأولوية</th>
                <th className="px-5 py-3.5 font-bold">الحالة</th>
                <th className="px-5 py-3.5 font-bold">آخر تحديث</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map(ticket => (
                <tr key={ticket._id} onClick={() => openTicket(ticket)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{ticket.subject}</td>
                  <td className="px-5 py-3.5 text-slate-600">{ticket.merchantId?.storeName || '—'}</td>
                  <td className="px-5 py-3.5"><span className="flex items-center gap-1.5">{(() => { const CatIcon = CATEGORY_ICONS[ticket.category]; return CatIcon ? <CatIcon size={14} className="text-slate-400" /> : null })()}{CATEGORY_LABELS[ticket.category] || ticket.category}</span></td>
                  <td className="px-5 py-3.5"><span className={clsx("font-bold", PRIORITY_MAP[ticket.priority]?.color)}>{PRIORITY_MAP[ticket.priority]?.label}</span></td>
                  <td className="px-5 py-3.5">
                    <span className={clsx("px-2.5 py-1 rounded-full text-xs font-bold", STATUS_MAP[ticket.status]?.bg, STATUS_MAP[ticket.status]?.color)}>
                      {STATUS_MAP[ticket.status]?.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Chat Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">{selectedTicket.subject}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <Store size={14} /> {selectedTicket.merchantId?.storeName || '—'}
                  <span className="mx-1">•</span>
                  {CATEGORY_LABELS[selectedTicket.category]}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedTicket.status}
                  onChange={e => handleStatusChange(selectedTicket._id, e.target.value)}
                  className={clsx("px-3 py-1.5 rounded-lg text-xs font-bold border outline-none", STATUS_MAP[selectedTicket.status]?.bg, STATUS_MAP[selectedTicket.status]?.color)}
                >
                  <option value="open">مفتوحة</option>
                  <option value="in_progress">قيد المعالجة</option>
                  <option value="resolved">تم الحل</option>
                  <option value="closed">مغلقة</option>
                </select>
                <button onClick={() => setSelectedTicket(null)} className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center"><X size={18} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {(selectedTicket.messages || []).map((msg: any, i: number) => (
                <div key={i} className={clsx("flex gap-3", msg.senderRole === 'admin' ? 'flex-row-reverse' : '')}>
                  <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.senderRole === 'admin' ? 'bg-matgarco-100 text-matgarco-600' : 'bg-blue-100 text-blue-600')}>
                    <User size={14} />
                  </div>
                  <div className={clsx("max-w-[70%] rounded-2xl px-4 py-3", msg.senderRole === 'admin' ? 'bg-matgarco-50 text-matgarco-900' : 'bg-slate-50 text-slate-900')}>
                    <div className="text-xs font-bold mb-1">{msg.senderName || (msg.senderRole === 'admin' ? 'الإدارة' : 'التاجر')}</div>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className="text-xs text-slate-400 mt-1">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</div>
                  </div>
                </div>
              ))}
              {(!selectedTicket.messages || selectedTicket.messages.length === 0) && (
                <div className="text-center py-10 text-slate-400 text-sm">لا توجد رسائل بعد</div>
              )}
            </div>

            {/* Reply Input */}
            <div className="p-4 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleReply()}
                  placeholder="اكتب ردك هنا..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-matgarco-500 text-sm"
                />
                <button onClick={handleReply} disabled={replying || !replyContent.trim()} className="px-5 py-3 rounded-xl bg-matgarco-600 text-white font-bold flex items-center gap-2 hover:bg-matgarco-700 disabled:bg-slate-300 transition-colors">
                  {replying ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
