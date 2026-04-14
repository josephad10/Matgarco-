import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI, merchantAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [step, setStep] = useState(1); // 1: User Info, 2: Store Info
  const [formData, setFormData] = useState({
    // User info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Store info
    storeName: '',
    subdomain: '',
    description: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);

  // Check subdomain availability
  const checkSubdomainMutation = useMutation({
    mutationFn: merchantAPI.checkSubdomain,
    onSuccess: (response) => {
      setSubdomainAvailable(response.data.data.available);
    },
  });

  // Register user
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: async (response) => {
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
      
      // Create merchant
      try {
        await merchantAPI.create({
          name: formData.storeName,
          subdomain: formData.subdomain,
          description: formData.description,
        });
        
        // Success! Navigate to onboarding wizard
        navigate('/onboarding');
      } catch (error: any) {
        console.error('Merchant creation error:', error.response?.data);
        
        // Show error but user is already logged in
        // They can retry creating merchant later
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            'فشل في إنشاء المتجر. حاول مرة أخرى.';
        
        setErrors({ 
          merchant: errorMessage + ' تم إنشاء حسابك بنجاح. يمكنك تسجيل الدخول.' 
        });
        
        // After 3 seconds, navigate to onboarding anyway
        setTimeout(() => {
          navigate('/onboarding');
        }, 3000);
      }
    },
    onError: (error: any) => {
      console.error('Registration error:', error.response?.data);
      
      // Handle validation errors
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        const validationErrors: any = {};
        error.response.data.details.forEach((detail: any) => {
          const field = detail.field?.replace('body.', '') || detail.path?.join('.') || 'unknown';
          const message = detail.message || detail.msg || 'خطأ في التحقق';
          validationErrors[field] = message;
          console.log('Validation error:', field, '=', message);
        });
        setErrors(validationErrors);
      } else {
        // Show user-friendly error message
        let errorMessage = 'فشل التسجيل. حاول مرة أخرى.';
        
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        // Translate common errors to Arabic
        if (errorMessage.toLowerCase().includes('email already')) {
          errorMessage = 'البريد الإلكتروني مسجل بالفعل';
        } else if (errorMessage.toLowerCase().includes('password')) {
          errorMessage = 'كلمة المرور يجب أن تحتوي على 8 أحرف، حرف كبير، حرف صغير، ورقم';
        } else if (errorMessage.toLowerCase().includes('network')) {
          errorMessage = 'خطأ في الاتصال. تأكد من تشغيل الخادم';
        }
        
        setErrors({ register: errorMessage });
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors
    setErrors({ ...errors, [name]: '' });
    
    // Check subdomain availability
    if (name === 'subdomain' && value.length >= 3) {
      setSubdomainAvailable(null);
      checkSubdomainMutation.mutate(value);
    }
  };

  const validateStep1 = () => {
    const newErrors: any = {};
    
    if (!formData.firstName) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!formData.lastName) newErrors.lastName = 'اسم العائلة مطلوب';
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: any = {};
    
    if (!formData.storeName) newErrors.storeName = 'اسم المتجر مطلوب';
    if (!formData.subdomain) newErrors.subdomain = 'النطاق الفرعي مطلوب';
    if (!subdomainAvailable) newErrors.subdomain = 'النطاق الفرعي غير متاح';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (validateStep2()) {
      registerMutation.mutate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Matgarco</h1>
          <p className="text-gray-600 mt-2">ابدأ متجرك الإلكتروني الآن</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Error Message */}
        {(errors.register || errors.merchant) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {errors.register || errors.merchant}
          </div>
        )}

        {/* Step 1: User Info */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الأول
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم العائلة
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              {!errors.password && (
                <p className="text-gray-500 text-xs mt-1">
                  ⓘ يجب أن تحتوي على 8 أحرف، حرف كبير، حرف صغير، ورقم
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              التالي
            </button>
          </form>
        )}

        {/* Step 2: Store Info */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المتجر
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.storeName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="متجر أحمد للإلكترونيات"
              />
              {errors.storeName && <p className="text-red-500 text-xs mt-1">{errors.storeName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النطاق الفرعي (Subdomain)
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleChange}
                  className={`flex-1 px-4 py-3 border rounded-l-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.subdomain ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ahmed-shop"
                />
                <span className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600">
                  .matgarco.com
                </span>
              </div>
              {subdomainAvailable === true && (
                <p className="text-green-600 text-xs mt-1">✓ النطاق متاح</p>
              )}
              {subdomainAvailable === false && (
                <p className="text-red-500 text-xs mt-1">✗ النطاق غير متاح</p>
              )}
              {errors.subdomain && <p className="text-red-500 text-xs mt-1">{errors.subdomain}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المتجر (اختياري)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="أفضل متجر للإلكترونيات في مصر"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                السابق
              </button>
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {registerMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء المتجر'}
              </button>
            </div>
          </form>
        )}

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
