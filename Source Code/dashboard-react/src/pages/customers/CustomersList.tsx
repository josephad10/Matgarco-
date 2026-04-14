import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Search,
  Users,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  ShoppingBag,
  TrendingUp,
  Download,
} from 'lucide-react';
import { customerAPI } from '../../lib/api';
import { downloadCSV } from '../../lib/exportCSV';

export const CustomersList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['customers', currentPage, searchQuery],
    queryFn: () =>
      customerAPI.getAll({
        page: currentPage,
        limit: 15,
        search: searchQuery || undefined,
      }),
  });

  const customers = data?.data?.data?.customers || [];
  const pagination = data?.data?.data?.pagination || {
    page: 1,
    pages: 1,
    total: 0,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-purple-100 text-purple-700',
      'bg-yellow-100 text-yellow-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const exportCustomers = () => {
    const rows = customers.map((c: any) => ({
      الاسم_الأول: c.firstName,
      الاسم_الأخير: c.lastName,
      البريد_الإلكتروني: c.email,
      التليفون: c.phone || '',
      المدينة: c.addresses?.[0]?.city || '',
      عدد_الطلبات: c.stats?.totalOrders || 0,
      إجمالي_الإنفاق: c.stats?.totalSpent || 0,
      متوسط_قيمة_الطلب: c.stats?.averageOrderValue || 0,
      آخر_طلب: formatDate(c.stats?.lastOrderDate),
      تاريخ_التسجيل: formatDate(c.createdAt),
    }));
    downloadCSV(`عملاء-${new Date().toISOString().slice(0, 10)}`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">العملاء</h1>
          <p className="text-gray-600 mt-1">
            إجمالي العملاء: {pagination.total}
          </p>
        </div>
        <button
          onClick={exportCustomers}
          disabled={customers.length === 0}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          <span>تصدير CSV</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي العملاء</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">عملاء لديهم طلبات</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.filter((c: any) => c.stats?.totalOrders > 0).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">متوسط قيمة الطلب</p>
              <p className="text-2xl font-bold text-gray-900">
                {customers.length > 0
                  ? Math.round(
                      customers.reduce(
                        (sum: number, c: any) => sum + (c.stats?.averageOrderValue || 0),
                        0
                      ) / customers.filter((c: any) => c.stats?.totalOrders > 0).length || 0
                    ).toLocaleString()
                  : 0}{' '}
                جنيه
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="بحث بالاسم أو الإيميل أو التليفون..."
              className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            بحث
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
            >
              مسح
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchQuery ? 'لا توجد نتائج' : 'لا يوجد عملاء بعد'}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? 'جرب كلمة بحث مختلفة'
                : 'سيظهر العملاء هنا بعد أول طلب شراء'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التواصل
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الطلبات
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجمالي الإنفاق
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      آخر طلب
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ التسجيل
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((customer: any) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                      {/* Avatar + Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${getAvatarColor(
                              customer.firstName + customer.lastName
                            )}`}
                          >
                            {getInitials(customer.firstName, customer.lastName)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </p>
                            {customer.addresses?.[0]?.city && (
                              <p className="text-xs text-gray-500">
                                {customer.addresses[0].city}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate max-w-[180px]">{customer.email}</span>
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Orders */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                          {customer.stats?.totalOrders || 0}
                        </span>
                      </td>

                      {/* Total Spent */}
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-gray-900">
                          {(customer.stats?.totalSpent || 0).toLocaleString()} جنيه
                        </span>
                      </td>

                      {/* Last Order */}
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {formatDate(customer.stats?.lastOrderDate)}
                      </td>

                      {/* Join Date */}
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {formatDate(customer.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <Link
                          to={`/dashboard/customers/${customer._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>تفاصيل</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {customers.map((customer: any) => (
                <div key={customer._id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${getAvatarColor(
                          customer.firstName + customer.lastName
                        )}`}
                      >
                        {getInitials(customer.firstName, customer.lastName)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <Link
                      to={`/dashboard/customers/${customer._id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">الطلبات</p>
                      <p className="font-semibold">{customer.stats?.totalOrders || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">الإنفاق</p>
                      <p className="font-semibold">{(customer.stats?.totalSpent || 0).toLocaleString()} جنيه</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">آخر طلب</p>
                      <p className="font-semibold">{formatDate(customer.stats?.lastOrderDate)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              صفحة {pagination.page} من {pagination.pages} — {pagination.total} عميل
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={currentPage === pagination.pages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
