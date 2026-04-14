import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { X, Edit, Loader2, Package, Tag, Calendar } from 'lucide-react';
import { productAPI } from '../../lib/api';

export const ViewProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch product data
  const { data: productResponse, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const product = productResponse?.data?.data?.product;

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">المنتج غير موجود</p>
        <button
          onClick={() => navigate('/dashboard/products')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          العودة للمنتجات
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'draft':
        return 'مسودة';
      case 'archived':
        return 'مؤرشف';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 mt-1">عرض تفاصيل المنتج</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/dashboard/products/${product._id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-5 h-5" />
            <span>تعديل</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/products')}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">صور المنتج</h2>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.map((img: any, index: number) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={typeof img === 'string' ? img : img.url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {((typeof img !== 'string' && img.isPrimary) || index === 0) && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-600 text-white">
                          الصورة الرئيسية
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Package className="w-16 h-16 mb-2" />
                <p>لا توجد صور</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">الوصف</h2>
            {product.description ? (
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            ) : (
              <p className="text-gray-400">لا يوجد وصف</p>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">التسعير</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">السعر</label>
                <p className="text-2xl font-bold text-blue-600">{product.price} جنيه</p>
              </div>
              {product.compareAtPrice && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">السعر قبل الخصم</label>
                  <p className="text-lg font-semibold text-gray-700 line-through">
                    {product.compareAtPrice} جنيه
                  </p>
                </div>
              )}
              {product.cost && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">التكلفة</label>
                  <p className="text-lg font-semibold text-gray-700">{product.cost} جنيه</p>
                </div>
              )}
            </div>

            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  خصم: {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </p>
              </div>
            )}
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">المخزون</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">الكمية المتوفرة</label>
                <p className="text-2xl font-bold text-gray-900">
                  {typeof product.stock === 'number' ? product.stock : product.quantity || 0}
                </p>
              </div>
              {product.lowStockThreshold && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">حد التنبيه</label>
                  <p className="text-lg font-semibold text-gray-700">{product.lowStockThreshold}</p>
                </div>
              )}
              {product.sku && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">SKU</label>
                  <p className="text-lg font-mono text-gray-700">{product.sku}</p>
                </div>
              )}
            </div>

            {product.stock !== undefined && product.stock <= (product.lowStockThreshold || 5) && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  ⚠️ تنبيه: المخزون منخفض!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">الحالة</h2>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
              {getStatusText(product.status)}
            </span>
          </div>

          {/* Category & Tags */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">التصنيف والوسوم</h2>
            
            {product.category && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">الفئة</label>
                <div className="flex items-center gap-2 text-gray-700">
                  <Tag className="w-4 h-4" />
                  <span>{product.category}</span>
                </div>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">الوسوم</label>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!product.category && (!product.tags || product.tags.length === 0) && (
              <p className="text-gray-400 text-sm">لا توجد فئات أو وسوم</p>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">إحصائيات</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">المشاهدات</span>
                <span className="font-semibold text-gray-900">{product.views || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المبيعات</span>
                <span className="font-semibold text-gray-900">{product.sales || 0}</span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">التواريخ</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-600">تاريخ الإنشاء</p>
                  <p className="font-medium text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString('ar-EG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              {product.updatedAt && product.updatedAt !== product.createdAt && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-600">آخر تحديث</p>
                    <p className="font-medium text-gray-900">
                      {new Date(product.updatedAt).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
