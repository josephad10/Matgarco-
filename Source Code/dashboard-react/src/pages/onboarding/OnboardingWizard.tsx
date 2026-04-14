import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { themeAPI, merchantAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// Step components
import StepStoreInfo from './steps/StepStoreInfo';
import StepTemplate from './steps/StepTemplate';
import StepColors from './steps/StepColors';
import StepSocial from './steps/StepSocial';
import StepDone from './steps/StepDone';

const STEPS = [
  { id: 1, label: 'معلومات المتجر', icon: '🏪' },
  { id: 2, label: 'اختر القالب',    icon: '🎨' },
  { id: 3, label: 'الألوان والخط',   icon: '✏️' },
  { id: 4, label: 'روابط التواصل',   icon: '📱' },
  { id: 5, label: 'جاهز!',          icon: '🚀' },
];

export interface OnboardingData {
  store: {
    name: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    currency: string;
  };
  templateId: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  social: {
    instagram: string;
    twitter: string;
    facebook: string;
    tiktok: string;
  };
}

const INITIAL: OnboardingData = {
  store: { name: '', description: '', phone: '', email: '', address: '', currency: 'SAR' },
  templateId: 'spark',
  colors: { primary: '#6366F1', secondary: '#8B5CF6', background: '#FFFFFF', text: '#111827' },
  social: { instagram: '', twitter: '', facebook: '', tiktok: '' },
};

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // 1. Apply template
      await themeAPI.applyTemplate(data.templateId);
      // 2. Save all customizations as draft
      await themeAPI.saveDraft({
        store: data.store,
        colors: data.colors,
        social: data.social,
      });
      // 3. Immediately publish so storefront is live
      await themeAPI.publish();
      // 4. Mark onboarding as completed
      if (user?.merchantId) {
        await merchantAPI.completeOnboarding(user.merchantId);
      }
    },
    onSuccess: () => {
      setStep(5);
    },
    onError: () => {
      toast.error('حدث خطأ أثناء الحفظ. تحقق من اتصالك.');
    },
  });

  const update = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        {step < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.slice(0, 4).map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold transition-all ${
                      step >= s.id
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-white text-gray-400 border border-gray-200'
                    }`}
                  >
                    {step > s.id ? '✓' : s.icon}
                  </div>
                  <span className={`text-[10px] font-medium text-center ${step >= s.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 right-0 h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden">
          {step === 1 && (
            <StepStoreInfo
              data={data.store}
              onChange={(store) => update({ store })}
              onNext={next}
            />
          )}
          {step === 2 && (
            <StepTemplate
              value={data.templateId}
              onChange={(templateId) => update({ templateId })}
              onNext={next}
              onBack={back}
            />
          )}
          {step === 3 && (
            <StepColors
              colors={data.colors}
              templateId={data.templateId}
              onChange={(colors) => update({ colors })}
              onNext={next}
              onBack={back}
            />
          )}
          {step === 4 && (
            <StepSocial
              social={data.social}
              onChange={(social) => update({ social })}
              onFinish={() => saveMutation.mutate()}
              onBack={back}
              loading={saveMutation.isPending}
            />
          )}
          {step === 5 && (
            <StepDone
              storeName={data.store.name}
              onGo={() => navigate('/dashboard')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
