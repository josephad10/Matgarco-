import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Store,
  User,
  MapPin,
  Globe,
  Camera,
  Save,
  Loader2,
  CheckCircle,
  Crown,
  AlertCircle,
  Phone,
  Mail,
  Building,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { merchantAPI, authAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import axios from '../../lib/axios';

const businessTypes = [
  { value: 'retail', label: 'بيع بالتجزئة' },
  { value: 'wholesale', label: 'بيع بالجملة' },
  { value: 'services', label: 'خدمات' },
  { value: 'other', label: 'أخرى' },
];

const currencies = [
  { value: 'EGP', label: 'جنيه مصري (EGP)' },
  { value: 'USD', label: 'دولار أمريكي (USD)' },
  { value: 'SAR', label: 'ريال سعودي (SAR)' },
  { value: 'AED', label: 'درهم إماراتي (AED)' },
];

const planLabels: Record<string, { label: string; color: string }> = {
  free_trial: { label: 'تجريبي مجاني', color: 'bg-yellow-100 text-yellow-800' },
  starter: { label: 'Starter', color: 'bg-blue-100 text-blue-800' },
  professional: { label: 'Professional', color: 'bg-purple-100 text-purple-800' },
  business: { label: 'Business', color: 'bg-green-100 text-green-800' },
};

type TabId = 'store' | 'contact' | 'address' | 'subscription' | 'account';

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'store', label: 'المتجر', icon: Store },
  { id: 'contact', label: 'التواصل', icon: Phone },
  { id: 'address', label: 'العنوان', icon: MapPin },
  { id: 'subscription', label: 'الاشتراك', icon: Crown },
  { id: 'account', label: 'حسابي', icon: User },
];

export const Settings: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TabId>('store');
  const [savedTab, setSavedTab] = useState<TabId | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Form state
  const [storeForm, setStoreForm] = useState({
    storeName: '',
    description: '',
    businessName: '',
    businessType: '',
    currency: 'EGP',
  });
  const [contactForm, setContactForm] = useState({
    email: '',
    phone: '',
  });
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    country: 'Egypt',
    postalCode: '',
  });
  const [accountForm, setAccountForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch merchant
  const { data: merchantData, isLoading } = useQuery({
    queryKey: ['merchant', user?.merchantId],
    queryFn: () => merchantAPI.getById(user!.merchantId!),
    enabled: !!user?.merchantId,
  });

  const merchant = merchantData?.data?.data?.merchant;

  // Populate forms when data loads
  useEffect(() => {
    if (merchant) {
      setStoreForm({
        storeName: merchant.storeName || '',
        description: merchant.description || '',
        businessName: merchant.businessName || '',
        businessType: merchant.businessType || '',
        currency: merchant.currency || 'EGP',
      });
      setContactForm({
        email: merchant.email || '',
        phone: merchant.phone || '',
      });
      setAddressForm({
        street: merchant.address?.street || '',
        city: merchant.address?.city || '',
        state: merchant.address?.state || '',
        country: merchant.address?.country || 'Egypt',
        postalCode: merchant.address?.postalCode || '',
      });
    }
    if (user) {
      setAccountForm((prev) => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      }));
    }
  }, [merchant, user]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Record<string, any>) =>
      merchantAPI.update(user!.merchantId!, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['merchant'] });
      if ('storeName' in variables) {
        setSavedTab('store');
        toast.success('تم حفظ بيانات المتجر ✅');
      } else if ('phone' in variables || 'email' in variables) {
        setSavedTab('contact');
        toast.success('تم حفظ بيانات التواصل ✅');
      } else if ('address' in variables) {
        setSavedTab('address');
        toast.success('تم حفظ العنوان ✅');
      }
      setTimeout(() => setSavedTab(null), 3000);
    },
    onError: () => toast.error('فشل حفظ التغييرات'),
  });

  // Update profile mutation
  const profileMutation = useMutation({
    mutationFn: (data: { firstName: string; lastName: string; phone?: string }) =>
      authAPI.updateProfile(data),
    onSuccess: (res) => {
      const updatedUser = res.data?.data?.user;
      if (updatedUser) updateUser(updatedUser);
      toast.success('تم تحديث بيانات الحساب ✅');
    },
    onError: () => toast.error('فشل تحديث بيانات الحساب'),
  });

  // Change password mutation
  const passwordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authAPI.changePassword(data),
    onSuccess: () => {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('تم تغيير كلمة المرور بنجاح ✅');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'فشل تغيير كلمة المرور';
      toast.error(msg);
    },
  });

  // Logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم الصورة أكبر من 2 ميجابايت');
      return;
    }
    setLogoUploading(true);
    const uploadToast = toast.loading('جاري رفع اللوجو...');
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'logos');
      const response = await axios.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { url } = response.data.data;
      await merchantAPI.update(user!.merchantId!, { logo: url });
      queryClient.invalidateQueries({ queryKey: ['merchant'] });
      toast.success('تم تحديث اللوجو ✅', { id: uploadToast });
    } catch {
      toast.error('فشل رفع الصورة', { id: uploadToast });
    } finally {
      setLogoUploading(false);
      e.target.value = '';
    }
  };

  const handleSaveStore = () => {
    updateMutation.mutate(storeForm);
  };

  const handleSaveContact = () => {
    updateMutation.mutate(contactForm);
  };

  const handleSaveAddress = () => {
    updateMutation.mutate({ address: addressForm });
  };

  const handleSaveAccount = () => {
    if (!accountForm.firstName.trim() || !accountForm.lastName.trim()) {
      toast.error('الاسم الأول والأخير مطلوبان');
      return;
    }
    profileMutation.mutate({
      firstName: accountForm.firstName,
      lastName: accountForm.lastName,
      phone: accountForm.phone || undefined,
    });
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error('يرجى تعبية جميع حقول كلمة المرور');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('كلمة المرور الجديدة 8 أحرف على الأقل');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('كلمة المرور الجديدة وتأكيدها غير متطابقتين');
      return;
    }
    passwordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const planInfo = planLabels[merchant?.subscriptionPlan] || planLabels.free_trial;
  const trialDaysLeft = merchant?.trialEndsAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(merchant.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      )
    : null;

  const SaveButton = ({ onClick, tab }: { onClick: () => void; tab: TabId }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={updateMutation.isPending}
      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
    >
      {updateMutation.isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : savedTab === tab ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {savedTab === tab ? 'تم الحفظ!' : 'حفظ التغييرات'}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-500 mt-1">إدارة إعدادات متجرك</p>
      </div>

      {/* Logo + Store Name Banner */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-xl bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center">
              {merchant?.logo ? (
                <img
                  src={merchant.logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <label className="absolute -bottom-2 -left-2 cursor-pointer">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700">
                {logoUploading ? (
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={logoUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Store Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{merchant?.storeName}</h2>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Globe className="w-4 h-4" />
                <span>{merchant?.subdomain}.matgarco.com</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${planInfo.color}`}>
                {planInfo.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              اضغط على أيقونة الكاميرا لتغيير اللوجو
            </p>
          </div>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Store Tab */}
          {activeTab === 'store' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    اسم المتجر <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={storeForm.storeName}
                    onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم متجرك"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    الاسم التجاري
                  </label>
                  <input
                    type="text"
                    value={storeForm.businessName}
                    onChange={(e) => setStoreForm({ ...storeForm, businessName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="الاسم الرسمي للشركة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    نوع النشاط
                  </label>
                  <select
                    value={storeForm.businessType}
                    onChange={(e) => setStoreForm({ ...storeForm, businessType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">اختر نوع النشاط</option>
                    {businessTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    العملة
                  </label>
                  <select
                    value={storeForm.currency}
                    onChange={(e) => setStoreForm({ ...storeForm, currency: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {currencies.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  وصف المتجر
                </label>
                <textarea
                  value={storeForm.description}
                  onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="اكتب وصفاً مختصراً عن متجرك..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  يظهر في صفحة المتجر للعملاء
                </p>
              </div>
              {/* Subdomain (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  رابط المتجر
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                    <Globe className="w-4 h-4 text-gray-400 ml-2" />
                    <span className="text-blue-600 font-medium">{merchant?.subdomain}</span>
                    <span>.matgarco.com</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  لتغيير الرابط تواصل مع الدعم
                </p>
              </div>
              <div className="flex justify-end">
                <SaveButton onClick={handleSaveStore} tab="store" />
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    رقم التليفون
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <SaveButton onClick={handleSaveContact} tab="contact" />
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  الشارع والرقم
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="الشارع والرقم"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    المدينة
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="القاهرة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    المحافظة / المنطقة
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="القاهرة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    البلد
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مصر"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    الكود البريدي
                  </label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="11511"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <SaveButton onClick={handleSaveAddress} tab="address" />
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="space-y-5">
              {/* Current Plan */}
              <div className="p-5 border-2 border-blue-200 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 rounded-lg">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">الخطة الحالية</p>
                      <p className="text-xl font-bold text-gray-900">{planInfo.label}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    merchant?.subscriptionStatus === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {merchant?.subscriptionStatus === 'active' ? 'نشط' : 'منتهي'}
                  </span>
                </div>

                {trialDaysLeft !== null && merchant?.subscriptionPlan === 'free_trial' && (
                  <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                    trialDaysLeft <= 3 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm font-medium">
                      {trialDaysLeft > 0
                        ? `باقي ${trialDaysLeft} يوم على انتهاء الفترة التجريبية`
                        : 'انتهت الفترة التجريبية'}
                    </p>
                  </div>
                )}
              </div>

              {/* Limits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <Building className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {merchant?.limits?.maxProducts === -1
                      ? '∞'
                      : merchant?.limits?.maxProducts || 20}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">حد المنتجات</p>
                  <p className="text-sm font-medium text-blue-600 mt-0.5">
                    {merchant?.stats?.totalProducts || 0} مستخدم
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <User className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {merchant?.limits?.maxStaffUsers || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">حد المستخدمين</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {merchant?.limits?.aiCreditsPerMonth || 5}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">AI رصيد شهري</p>
                  <p className="text-sm font-medium text-orange-500 mt-0.5">
                    {merchant?.limits?.aiCreditsUsed || 0} مستخدم
                  </p>
                </div>
              </div>

              {/* Plans */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">الخطط المتاحة</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'starter', name: 'Starter', price: '250 جنيه/شهر', commission: '2%', products: 100 },
                    { id: 'professional', name: 'Professional', price: '450 جنيه/شهر', commission: '0%', products: -1, popular: true },
                    { id: 'business', name: 'Business', price: '699 جنيه/شهر', commission: '0%', products: -1 },
                  ].map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative border-2 rounded-xl p-5 ${
                        plan.popular ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-3 right-1/2 translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                          الأكثر شيوعاً
                        </span>
                      )}
                      <p className="font-bold text-gray-900 text-lg">{plan.name}</p>
                      <p className="text-blue-600 font-semibold mt-1">{plan.price}</p>
                      <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
                        <li>المنتجات: {plan.products === -1 ? 'غير محدودة' : plan.products}</li>
                        <li>عمولة: {plan.commission}</li>
                      </ul>
                      <button
                        disabled={merchant?.subscriptionPlan === plan.id}
                        className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition ${
                          merchant?.subscriptionPlan === plan.id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {merchant?.subscriptionPlan === plan.id ? 'خطتك الحالية' : 'الترقية'}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  للترقية تواصل معنا على: support@matgarco.com
                </p>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              {/* Personal Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  البيانات الشخصية
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      الاسم الأول <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountForm.firstName}
                      onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="الاسم الأول"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      الاسم الأخير <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountForm.lastName}
                      onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="الاسم الأخير"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      البريد الإلكتروني
                    </label>
                    <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user?.email}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      رقم الهاتف
                    </label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={accountForm.phone}
                        onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                        className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="01xxxxxxxxx"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-5">
                  <button
                    type="button"
                    onClick={handleSaveAccount}
                    disabled={profileMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                  >
                    {profileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    حفظ البيانات
                  </button>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Change Password */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-500" />
                  تغيير كلمة المرور
                </h3>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      كلمة المرور الحالية
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                        placeholder="8 أحرف على الأقل"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordForm.newPassword.length > 0 && passwordForm.newPassword.length < 8 && (
                      <p className="text-xs text-red-500 mt-1">كلمة المرور قصيرة جداً</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      تأكيد كلمة المرور
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300'
                      }`}
                      placeholder="أعد كتابة كلمة المرور"
                    />
                    {passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword && (
                      <p className="text-xs text-red-500 mt-1">كلمتا المرور غير متطابقتان</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={passwordMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
                  >
                    {passwordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    تغيير كلمة المرور
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
