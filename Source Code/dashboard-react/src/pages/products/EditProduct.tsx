import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X, Save, Loader2, Plus } from 'lucide-react';
import { productAPI } from '../../lib/api';
import { ImageUpload } from '../../components/ImageUpload';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  lowStockThreshold?: number;
  category?: string;
  tags?: string[];
  images: string[];
  imagePublicIds: string[];
  status: 'active' | 'draft' | 'archived';
  variants?: any[];
}

export const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    images: [],
    imagePublicIds: [],
    status: 'active',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<any>({});

  // Fetch product data
  const { data: productResponse, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id!),
    enabled: !!id,
  });

  // Populate form with product data
  useEffect(() => {
    if (productResponse?.data?.data?.product) {
      const product = productResponse.data.data.product;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        compareAtPrice: product.compareAtPrice || undefined,
        cost: product.cost || undefined,
        sku: product.sku || '',
        barcode: product.barcode || '',
        stock: product.stock || 0,
        lowStockThreshold: product.lowStockThreshold || undefined,
        category: product.category || '',
        tags: product.tags || [],
        images: Array.isArray(product.images) 
          ? product.images.map((img: any) => typeof img === 'string' ? img : img.url)
          : [],
        imagePublicIds: product.imagePublicIds || [],
        status: (product.status as 'active' | 'draft' | 'archived') || 'active',
      });
    }
  }, [productResponse]);

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => productAPI.update(id!, data),
    onSuccess: () => {
      toast.success('تم تحديث المنتج بنجاح ✅');
      navigate('/dashboard/products');
    },
    onError: (error: any) => {
      let errorMessage = 'فشل في تحديث المنتج';
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        errorMessage = error.response.data.details.map((d: any) => d.message).join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    },
  });

  const handleSubmit = (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();
    setErrors({});

    // Validation
    if (!formData.name.trim()) {
      setErrors({ name: 'اسم المنتج مطلوب' });
      return;
    }
    if (formData.price <= 0) {
      setErrors({ price: 'السعر يجب أن يكون أكبر من صفر' });
      return;
    }

    // Prepare data
    const productData = {
      name: formData.name,
      description: formData.description || '',
      price: formData.price,
      compareAtPrice: formData.compareAtPrice || undefined,
      cost: formData.cost || undefined,
      sku: formData.sku || undefined,
      barcode: formData.barcode || undefined,
      stock: formData.stock || 0,
      lowStockThreshold: formData.lowStockThreshold || undefined,
      category: formData.category || undefined,
      tags: formData.tags || [],
      images: formData.images || [],
      imagePublicIds: formData.imagePublicIds || [],
      status: isDraft ? 'draft' : formData.status,
    };

    // Submit
    updateMutation.mutate(productData);
  };

  const handleImageUploaded = (url: string, publicId: string) => {
    setFormData({
      ...formData,
      images: [...formData.images, url],
      imagePublicIds: [...formData.imagePublicIds, publicId],
    });
  };

  const handleImageRemoved = (index: number) => {
    const newImages = [...formData.images];
    const newImagePublicIds = [...formData.imagePublicIds];
    newImages.splice(index, 1);
    newImagePublicIds.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages,
      imagePublicIds: newImagePublicIds,
    });
  };

  const handleImagesReordered = (reorderedImages: string[]) => {
    setFormData({
      ...formData,
      images: reorderedImages,
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!productResponse?.data?.data?.product) {
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل المنتج</h1>
          <p className="text-gray-600 mt-1">تحديث معلومات المنتج</p>
        </div>

        <button
          onClick={() => navigate('/dashboard/products')}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            المعلومات الأساسية
          </h2>

          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المنتج <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: هاتف iPhone 15 Pro"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="وصف تفصيلي للمنتج..."
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            صور المنتج
          </h2>
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            onImageRemoved={handleImageRemoved}
            onImagesReordered={handleImagesReordered}
            maxImages={5}
            currentImages={formData.images}
          />
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            التسعير
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السعر <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  جنيه
                </span>
              </div>
              {errors.price && (
                <p className="text-red-600 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السعر قبل الخصم
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.compareAtPrice || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compareAtPrice: parseFloat(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  جنيه
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التكلفة
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.cost || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cost: parseFloat(e.target.value) || undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  جنيه
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">المخزون</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الكمية المتوفرة
              </label>
              <input
                type="number"
                value={formData.stock || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حد التنبيه
              </label>
              <input
                type="number"
                value={formData.lowStockThreshold || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lowStockThreshold: parseInt(e.target.value) || undefined,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                تنبيه عند وصول المخزون لهذا الحد
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="PROD-001"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            الفئات والوسوم
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الفئة
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: إلكترونيات"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوسوم
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أضف وسم..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">الحالة</h2>

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'active' | 'draft' | 'archived',
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="active">نشط - يظهر في المتجر</option>
            <option value="draft">مسودة - مخفي</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {errors.submit}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard/products')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={updateMutation.isPending}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            حفظ كمسودة
          </button>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري التحديث...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
