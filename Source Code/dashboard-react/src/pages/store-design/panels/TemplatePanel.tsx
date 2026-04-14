import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from '@/lib/axios';
import { Crown, Download, Check, Loader2, Palette } from 'lucide-react';

interface Props {
  draft: any;
  onChange: (update: Record<string, any>) => void;
  subdomain: string;
  onRefresh?: () => void;
}

interface ThemeItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  isPremium: boolean;
  allowedPlans: string[];
  globalSettings: {
    colors: Record<string, string>;
    typography: Record<string, string>;
  };
  thumbnail?: string;
}

export default function TemplatePanel({ draft, onRefresh }: Props) {
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fetch available themes from DB
  const { data: themes = [], isLoading } = useQuery<ThemeItem[]>({
    queryKey: ['available-themes'],
    queryFn: async () => {
      // Use the public store-themes browse endpoint, or fallback to theme/storefront
      try {
        const res = await axios.get('/themes/browse');
        return res.data.data || [];
      } catch {
        // Fallback: fetch from super-admin themes (temp during dev)
        try {
          const res = await axios.get('/super-admin/themes');
          return res.data.data || [];
        } catch {
          return [];
        }
      }
    },
    staleTime: 60_000,
  });

  // Install a theme
  const installMutation = useMutation({
    mutationFn: async (themeId: string) => {
      const res = await axios.post(`/store-themes/install/${themeId}`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['theme'] });
      toast.success('تم تثبيت القالب بنجاح! 🎉');
      setTimeout(() => onRefresh?.(), 500);
    },
    onError: () => toast.error('فشل تثبيت القالب'),
  });

  // Get current template slug
  const currentTemplate = draft?.templateId || draft?.globalSettings?.templateSlug || '';

  // Category filter
  const CATEGORIES = [
    { id: 'all', label: 'الكل' },
    { id: 'general', label: 'عام' },
    { id: 'fashion', label: 'أزياء' },
    { id: 'electronics', label: 'إلكترونيات' },
    { id: 'food', label: 'طعام' },
  ];

  const filtered = selectedCategory === 'all'
    ? themes
    : themes.filter(t => t.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-sm text-gray-800 mb-1">🎨 متجر القوالب</h3>
        <p className="text-xs text-gray-400">اختر قالب وثبّته على متجرك. يمكنك تعديل الألوان والأقسام بعد التثبيت.</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1 flex-wrap">
        {CATEGORIES.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
              selectedCategory === cat.id 
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Themes Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-xs text-gray-400">لا توجد قوالب في هذا التصنيف</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map(theme => {
            const isActive = currentTemplate === theme.slug;
            const colors = theme.globalSettings?.colors || {};
            const isInstalling = installMutation.isPending && installMutation.variables === theme._id;

            return (
              <div 
                key={theme._id}
                className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                  isActive ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                {/* Color Preview Bar */}
                <div className="h-16 flex">
                  {['primary', 'secondary', 'background', 'surface', 'accent'].map(key => (
                    <div key={key} className="flex-1" style={{ backgroundColor: colors[key] || '#eee' }} />
                  ))}
                </div>

                {/* Info */}
                <div className="p-3 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Palette size={12} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-900">{theme.name}</span>
                      {theme.isPremium && (
                        <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                          <Crown size={9} /> Premium
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <span className="bg-indigo-100 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Check size={9} /> مُثبّت
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mb-2 line-clamp-2">{theme.description}</p>

                  {!isActive && (
                    <button
                      onClick={() => installMutation.mutate(theme._id)}
                      disabled={installMutation.isPending}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                    >
                      {isInstalling ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Download size={12} />
                      )}
                      {isInstalling ? 'جارٍ التثبيت...' : 'تثبيت القالب'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
