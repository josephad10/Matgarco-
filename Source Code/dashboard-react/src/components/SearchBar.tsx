import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, ShoppingCart, Loader2, SearchX } from 'lucide-react';
import { searchAPI } from '../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProductResult {
  _id: string;
  name: string;
  price: number;
  status: string;
  sku?: string;
  images?: { url: string }[];
}

interface OrderResult {
  _id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  customerInfo: { firstName: string; lastName: string };
}

interface CustomerResult {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface SearchResults {
  products: ProductResult[];
  orders: OrderResult[];
  customers: CustomerResult[];
}

const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'معلق',
  confirmed: 'مؤكد',
  processing: 'قيد التجهيز',
  shipped: 'تم الشحن',
  delivered: 'مكتمل',
  cancelled: 'ملغي',
};

// ─── Debounce hook ────────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Component ────────────────────────────────────────────────────────────────
const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 350);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults(null);
      setOpen(false);
      return;
    }
    setLoading(true);
    searchAPI
      .query(debouncedQuery)
      .then((res: any) => {
        setResults(res.data.data);
        setOpen(true);
      })
      .catch(() => setResults(null))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleNavigate = useCallback(
    (path: string) => {
      setOpen(false);
      setQuery('');
      navigate(path);
    },
    [navigate]
  );

  const hasResults =
    results &&
    (results.products.length > 0 || results.orders.length > 0 || results.customers.length > 0);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-lg">
      {/* Input */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        {loading && (
          <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && hasResults && setOpen(true)}
          placeholder="بحث في المنتجات، الطلبات، العملاء..."
          className="w-full pr-9 pl-4 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-2 right-0 w-full min-w-[420px] bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {!hasResults ? (
            /* No results */
            <div className="flex flex-col items-center py-10 text-gray-400">
              <SearchX className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">لا توجد نتائج لـ "{query}"</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {/* Products */}
              {results!.products.length > 0 && (
                <section>
                  <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                    المنتجات
                  </p>
                  {results!.products.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => handleNavigate(`/dashboard/products/${p._id}`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-right"
                    >
                      {p.images?.[0]?.url ? (
                        <img
                          src={p.images[0].url}
                          alt={p.name}
                          className="h-9 w-9 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Package className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                        {p.sku && <p className="text-xs text-gray-400">SKU: {p.sku}</p>}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 flex-shrink-0">
                        {p.price.toFixed(2)} ج.م
                      </span>
                    </button>
                  ))}
                </section>
              )}

              {/* Orders */}
              {results!.orders.length > 0 && (
                <section>
                  <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                    الطلبات
                  </p>
                  {results!.orders.map((o) => (
                    <button
                      key={o._id}
                      onClick={() => handleNavigate(`/dashboard/orders/${o._id}`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-right"
                    >
                      <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          #{o.orderNumber}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {o.customerInfo.firstName} {o.customerInfo.lastName}
                        </p>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0 gap-1">
                        <span className="text-sm font-semibold text-gray-700">
                          {o.total.toFixed(2)} ج.م
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            o.orderStatus === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : o.orderStatus === 'cancelled'
                              ? 'bg-red-100 text-red-600'
                              : o.orderStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {ORDER_STATUS_LABEL[o.orderStatus] || o.orderStatus}
                        </span>
                      </div>
                    </button>
                  ))}
                </section>
              )}

              {/* Customers */}
              {results!.customers.length > 0 && (
                <section>
                  <p className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                    العملاء
                  </p>
                  {results!.customers.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => handleNavigate(`/dashboard/customers/${c._id}`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-right"
                    >
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-xs text-gray-400 truncate">{c.email}</p>
                      </div>
                      {c.phone && (
                        <span className="text-xs text-gray-400 flex-shrink-0">{c.phone}</span>
                      )}
                    </button>
                  ))}
                </section>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
