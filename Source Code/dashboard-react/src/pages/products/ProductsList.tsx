import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Grid3x3,
  List,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ArrowRight,
  ChevronLeft as ArrowLeft,
  Download,
  CheckSquare,
  Square,
  X,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { productAPI } from '../../lib/api';
import { downloadCSV } from '../../lib/exportCSV';

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'active' | 'draft' | 'out_of_stock';

// Image Carousel Component for Product Cards
const ProductImageCarousel: React.FC<{ images: any[], productName: string }> = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasMultipleImages = images && images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getImageUrl = (img: any) => {
    if (!img) return null;
    return typeof img === 'string' ? img : img.url;
  };

  return (
    <div className="relative aspect-square bg-gray-100">
      {images && images.length > 0 ? (
        <>
          <img
            src={getImageUrl(images[currentImageIndex])}
            alt={productName}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="الصورة السابقة"
              >
                <ArrowLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="الصورة التالية"
              >
                <ArrowRight className="w-4 h-4 text-gray-700" />
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Package className="w-16 h-16 text-gray-300" />
        </div>
      )}
    </div>
  );
};

export const ProductsList: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', currentPage, searchQuery, statusFilter],
    queryFn: () =>
      productAPI.getAll({
        page: currentPage,
        limit: 12,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }),
  });

  const products = data?.data?.data?.products || [];
  const pagination = data?.data?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  };

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => productAPI.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('تم حذف المنتج بنجاح');
    },
    onError: () => {
      toast.error('فشل حذف المنتج');
    },
  });

  const handleDelete = (productId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteMutation.mutate(productId);
    }
  };

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) => productAPI.delete(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`تم حذف ${selectedIds.size} منتج`);
      setSelectedIds(new Set());
    },
    onError: () => toast.error('فشل الحذف المجمع'),
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) =>
      Promise.all(ids.map((id) => productAPI.update(id, { status }))),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`تم تحديث ${vars.ids.length} منتج`);
      setSelectedIds(new Set());
    },
    onError: () => toast.error('فشل تحديث الحالة'),
  });

  const handleBulkDelete = () => {
    if (confirm(`هل أنت متأكد من حذف ${selectedIds.size} منتج؟`)) {
      bulkDeleteMutation.mutate([...selectedIds]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p: any) => p._id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const exportProducts = () => {
    const rows = products.map((p: any) => ({
      الاسم: p.name,
      SKU: p.sku || '',
      السعر: p.price,
      المخزون: p.stock ?? 0,
      الحالة: p.status === 'active' ? 'نشط' : p.status === 'draft' ? 'مسودة' : 'غير نشط',
      الفئة: p.category || '',
      تاريخ_الإضافة: p.createdAt ? new Date(p.createdAt).toLocaleDateString('ar-EG') : '',
    }));
    downloadCSV(`منتجات-${new Date().toISOString().slice(0, 10)}`, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
          <p className="text-gray-600 mt-1">
            إدارة منتجات متجرك ({pagination.totalProducts} منتج)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportProducts}
            disabled={products.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            <span>تصدير CSV</span>
          </button>
          <Link
            to="/dashboard/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة منتج</span>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="draft">مسودة</option>
            <option value="out_of_stock">نفذ من المخزون</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-blue-700">
            {selectedIds.size} منتج محدد
          </span>
          <div className="flex items-center gap-2 mr-auto">
            <button
              onClick={() => bulkStatusMutation.mutate({ ids: [...selectedIds], status: 'active' })}
              disabled={bulkStatusMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <ToggleRight className="w-4 h-4" />
              تفعيل
            </button>
            <button
              onClick={() => bulkStatusMutation.mutate({ ids: [...selectedIds], status: 'draft' })}
              disabled={bulkStatusMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
            >
              <ToggleLeft className="w-4 h-4" />
              مسودة
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              حذف المحدد
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse"
            >
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700">حدث خطأ في تحميل المنتجات</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && products.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            لا توجد منتجات
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? 'لم يتم العثور على منتجات مطابقة لبحثك'
              : 'ابدأ بإضافة منتجك الأول'}
          </p>
          {!searchQuery && (
            <Link
              to="/dashboard/products/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة منتج جديد</span>
            </Link>
          )}
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && products.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div
              key={product._id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group ${
                selectedIds.has(product._id) ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-200'
              }`}
            >
              {/* Product Image with Carousel */}
              <div className="relative">
                {/* Checkbox overlay */}
                <button
                  onClick={() => toggleSelect(product._id)}
                  className="absolute top-2 right-2 z-20 p-0.5 bg-white rounded shadow"
                >
                  {selectedIds.has(product._id) ? (
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <ProductImageCarousel
                  images={product.images}
                  productName={product.name}
                />

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Link
                    to={`/dashboard/products/${product._id}`}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="عرض"
                  >
                    <Eye className="w-5 h-5 text-gray-700" />
                  </Link>
                  <Link
                    to={`/dashboard/products/${product._id}/edit`}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="تعديل"
                  >
                    <Edit className="w-5 h-5 text-blue-600" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                {/* Status Badge */}
                {product.status !== 'active' && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                      {product.status === 'draft' ? 'مسودة' : 'غير نشط'}
                    </span>
                  </div>
                )}

                {/* Stock Badge */}
                {typeof product.stock === 'number' && product.stock <= 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                      نفذ من المخزون
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description || 'لا يوجد وصف'}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-lg font-bold text-blue-600">
                      {product.price} جنيه
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    المخزون: {typeof product.stock === 'number' ? product.stock : '0'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products List View */}
      {!isLoading && !error && products.length > 0 && viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-10">
                  <button onClick={handleSelectAll}>
                    {selectedIds.size === products.length && products.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  المنتج
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  السعر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  المخزون
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product: any) => (
                <tr
                  key={product._id}
                  className={`hover:bg-gray-50 ${selectedIds.has(product._id) ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-4">
                    <button onClick={() => toggleSelect(product._id)}>
                      {selectedIds.has(product._id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {product.sku || 'لا يوجد SKU'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {product.price} جنيه
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-medium ${
                        product.stock <= 0
                          ? 'text-red-600'
                          : product.stock <= 10
                          ? 'text-yellow-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status === 'active'
                        ? 'نشط'
                        : product.status === 'draft'
                        ? 'مسودة'
                        : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/dashboard/products/${product._id}`}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="عرض"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/dashboard/products/${product._id}/edit`}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="تعديل"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-600">
            صفحة {pagination.currentPage} من {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
