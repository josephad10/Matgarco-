import { useState, useRef, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Palette, LayoutPanelLeft, Type, Save, Smartphone, Monitor, ChevronRight, Loader2, AlertCircle, RotateCcw, CheckCircle2, Circle } from 'lucide-react';
import clsx from 'clsx';
import api from '../lib/api';
import toast from 'react-hot-toast';
import SectionsPanel from './SectionsPanel';

type ViewportSize = 'desktop' | 'mobile';
type SidebarTab = 'colors' | 'typography' | 'sections';
type BuilderPageId = 'global' | 'home' | 'categories' | 'products' | 'about' | 'contact' | 'faq' | 'shipping' | 'returns' | 'privacy' | 'terms';

const BUILDER_PAGES: Array<{ id: BuilderPageId; label: string; path: string }> = [
  { id: 'global', label: 'Global (Header/Footer)', path: '' },
  { id: 'home', label: 'الرئيسية', path: '' },
  { id: 'categories', label: 'التصنيفات', path: '/categories' },
  { id: 'products', label: 'المنتجات', path: '/products' },
  { id: 'about', label: 'من نحن', path: '/about' },
  { id: 'contact', label: 'اتصل بنا', path: '/contact' },
  { id: 'faq', label: 'الأسئلة الشائعة', path: '/faq' },
  { id: 'shipping', label: 'سياسة الشحن', path: '/shipping' },
  { id: 'returns', label: 'سياسة الاسترجاع', path: '/returns' },
  { id: 'privacy', label: 'سياسة الخصوصية', path: '/privacy' },
  { id: 'terms', label: 'الشروط والأحكام', path: '/terms' },
];

// ─── All 8 color fields ──────────────────────────────────────────────────────
const COLOR_FIELDS = [
  { key: 'primary',   label: 'اللون الرئيسي',   default: '#3B82F6' },
  { key: 'secondary', label: 'اللون الثانوي',    default: '#1E40AF' },
  { key: 'background',label: 'خلفية الموقع',     default: '#F8FAFC' },
  { key: 'surface',   label: 'سطح البطاقات',     default: '#FFFFFF' },
  { key: 'text',      label: 'لون النص',         default: '#111827' },
  { key: 'textMuted', label: 'نص ثانوي',         default: '#6B7280' },
  { key: 'accent',    label: 'لون التمييز',       default: '#10B981' },
  { key: 'border',    label: 'لون الحدود',        default: '#E5E7EB' },
];

// ─── Available Google Fonts ──────────────────────────────────────────────────
const FONTS = [
  'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', 'Almarai', 'Changa',
  'Readex Pro', 'Noto Sans Arabic', 'Rubik', 'Inter', 'Outfit',
];

const FONT_SIZES = [
  { id: 'sm', label: 'صغير (15px)' },
  { id: 'md', label: 'متوسط (16px)' },
  { id: 'lg', label: 'كبير (17px)' },
];

export default function ThemeMaker() {
  const { id } = useParams();
  const qc = useQueryClient();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [activeTab, setActiveTab] = useState<SidebarTab>('colors');
  const [selectedPage, setSelectedPage] = useState<BuilderPageId>('home');
  const [isSaving, setIsSaving] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Fetch Base Theme data
  const { data: themeData, isLoading, error } = useQuery({
    queryKey: ['masterTheme', id],
    queryFn: async () => {
      const res = await api.get(`/super-admin/themes/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const saveMutation = useMutation({
    mutationFn: (update: Record<string, any>) => api.patch(`/super-admin/themes/${id}`, update),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['masterTheme', id] });
      toast.success('تم الحفظ');
    },
    onError: () => toast.error('فشل حفظ القالب'),
    onMutate: () => setIsSaving(true),
    onSettled: () => setIsSaving(false),
  });

  const refreshIframe = useCallback(() => {
    if (iframeRef.current) {
      const src = iframeRef.current.src.split('&_t=')[0];
      iframeRef.current.src = `${src}&_t=${Date.now()}`;
    }
  }, []);

  const dispatchLiveUpdate = useCallback((themeState: any) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'STORE_THEME_UPDATE', payload: { globalSettings: themeState.globalSettings, pages: themeState.pages } },
        '*'
      );
    }
  }, []);

  // Debounced save — instant UI + CSS update, debounced API save
  const handleThemeChange = useCallback((update: Record<string, any>) => {
    const currentTheme = (qc.getQueryData(['masterTheme', id]) as any) || themeData;
    if (!currentTheme) return;

    let merged = { ...currentTheme, ...update };
    if (update.globalSettings) {
      merged.globalSettings = {
        ...(currentTheme.globalSettings || {}),
        ...update.globalSettings,
        colors: { ...(currentTheme.globalSettings?.colors || {}), ...(update.globalSettings.colors || {}) },
        typography: { ...(currentTheme.globalSettings?.typography || {}), ...(update.globalSettings.typography || {}) },
        layout: { ...(currentTheme.globalSettings?.layout || {}), ...(update.globalSettings.layout || {}) },
      };
    }
    if (update.pages) {
      merged.pages = { ...(currentTheme.pages || {}), ...update.pages };
    }
    
    // 1. Instant live preview
    dispatchLiveUpdate(merged);
    // 2. Optimistic local update
    qc.setQueryData(['masterTheme', id], () => merged);
    // 3. Debounced save
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveMutation.mutate({
        globalSettings: merged.globalSettings,
        pages: merged.pages,
        status: merged.status,
      });
    }, 600);
  }, [themeData, id, qc, dispatchLiveUpdate, saveMutation]);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const gs = themeData?.globalSettings || {};
  const colors = gs.colors || {};
  const typography = gs.typography || {};

  const setColor = (key: string, value: string) => {
    handleThemeChange({ globalSettings: { colors: { [key]: value } } });
  };

  const setTypography = (key: string, value: string) => {
    handleThemeChange({ globalSettings: { typography: { [key]: value } } });
  };

  const completionItems = useMemo(() => {
    if (!themeData) {
      return [
        { id: 'meta', label: 'تعريف القالب (اسم + slug + تصنيف)', done: false },
        { id: 'visual', label: 'الهوية البصرية (ألوان + خطوط)', done: false },
        { id: 'global', label: 'Global Layout (Header/Footer)', done: false },
        { id: 'home', label: 'تجهيز صفحة الرئيسية', done: false },
        { id: 'content', label: 'تجهيز صفحات المحتوى', done: false },
        { id: 'publish', label: 'جاهزية النشر', done: false },
      ];
    }

    const hasMeta = !!(themeData.name && themeData.slug && themeData.category);
    const hasVisual = !!(Object.keys(colors).length >= 8 && typography.headingFont && typography.fontFamily);
    const globalSections = themeData.pages?.global?.sections || [];
    const hasGlobal = globalSections.some((s: any) => s.type === 'header') && globalSections.some((s: any) => s.type === 'footer');
    const hasHome = (themeData.pages?.home?.sections || []).length > 0;
    const contentPages = BUILDER_PAGES.filter((p) => !['global', 'home'].includes(p.id));
    const hasContentPages = contentPages.some((p) => (themeData.pages?.[p.id]?.sections || []).length > 0);
    const isPublished = themeData.status === 'active';

    return [
      { id: 'meta', label: 'تعريف القالب (اسم + slug + تصنيف)', done: hasMeta },
      { id: 'visual', label: 'الهوية البصرية (ألوان + خطوط)', done: hasVisual },
      { id: 'global', label: 'Global Layout (Header/Footer)', done: hasGlobal },
      { id: 'home', label: 'تجهيز صفحة الرئيسية', done: hasHome },
      { id: 'content', label: 'تجهيز صفحات المحتوى', done: hasContentPages },
      { id: 'publish', label: 'جاهزية النشر', done: isPublished },
    ];
  }, [themeData, colors, typography]);

  // ─── Loading / Error ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-matgarco-500" />
      </div>
    );
  }

  if (error || !themeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-4">
        <AlertCircle size={40} className="text-red-400" />
        <p className="font-bold text-lg">فشل تحميل القالب أو غير موجود.</p>
        <Link to="/themes" className="text-matgarco-600 hover:underline">العودة لقائمة القوالب</Link>
      </div>
    );
  }

  const storefrontPort = import.meta.env.VITE_STOREFRONT_PORT || '3001';
  const selectedPageMeta = BUILDER_PAGES.find((p) => p.id === selectedPage) || BUILDER_PAGES[1];
  const iframeSrc = `http://localhost:${storefrontPort}/store/demo-preview${selectedPageMeta.path}?master_theme_id=${id}&preview=1`;

  const SIDEBAR_TABS = [
    { id: 'colors'     as const, label: 'الألوان',  Icon: Palette },
    { id: 'typography' as const, label: 'الخطوط',   Icon: Type },
    { id: 'sections'   as const, label: 'الأقسام',  Icon: LayoutPanelLeft },
  ];

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-100 overflow-hidden font-cairo">
      
      {/* ─── LEFT SIDEBAR ─── */}
      <aside className="w-[380px] bg-white border-l flex flex-col shadow-2xl relative z-10 shrink-0">
        
        {/* Header */}
        <header className="h-[56px] border-b flex items-center justify-between px-4 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/themes" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <ChevronRight size={18} />
            </Link>
            <div>
              <h2 className="font-black text-sm text-slate-900 leading-tight truncate w-44">{themeData.name}</h2>
              <div className="text-[10px] font-bold text-slate-400 truncate w-44">v{themeData.version} · {themeData.category}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <select
              value={themeData.status || 'draft'}
              onChange={(e) => handleThemeChange({ status: e.target.value })}
              className="h-7 px-2 rounded-lg border border-slate-200 bg-white text-[11px] font-bold text-slate-700 outline-none"
            >
              <option value="draft">مسودة</option>
              <option value="maintenance">صيانة</option>
              <option value="active">نشط</option>
            </select>
            <button onClick={refreshIframe} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors" title="تحديث المعاينة">
              <RotateCcw size={14} />
            </button>
            <button onClick={() => saveMutation.mutate({ globalSettings: gs, pages: themeData.pages, status: themeData.status })} disabled={isSaving} className="text-xs font-bold text-white bg-matgarco-500 hover:bg-matgarco-600 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50">
              {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />} حفظ
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {SIDEBAR_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all border-b-2",
                activeTab === tab.id
                  ? "text-matgarco-600 border-matgarco-500 bg-white"
                  : "text-slate-400 border-transparent hover:text-slate-600"
              )}
            >
              <tab.Icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <h4 className="text-xs font-black text-slate-700">Workflow إنشاء قالب جديد</h4>
            <div className="space-y-1.5">
              {completionItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                  {item.done ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Circle size={14} className="text-slate-300" />}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Warning */}
          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-start gap-2">
            <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[10px] font-bold text-amber-900 leading-relaxed">
              تحذير: أي تعديل يغير القالب الأساسي. لن يؤثر على المتاجر المثبتة مسبقاً.
            </p>
          </div>

          {/* ═══ COLORS TAB ═══ */}
          {activeTab === 'colors' && (
            <div className="space-y-3">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <Palette size={15} /> الألوان الافتراضية
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {COLOR_FIELDS.map(cf => (
                  <div key={cf.key} className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 block">{cf.label}</label>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-1 pr-2">
                      <input
                        type="color"
                        value={colors[cf.key] || cf.default}
                        onChange={e => setColor(cf.key, e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden shrink-0"
                      />
                      <input
                        type="text"
                        value={colors[cf.key] || cf.default}
                        onChange={e => setColor(cf.key, e.target.value)}
                        className="flex-1 bg-transparent text-[11px] font-mono text-slate-600 outline-none w-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quick reset */}
              <button
                onClick={() => {
                  const defaults: Record<string, string> = {};
                  COLOR_FIELDS.forEach(cf => { defaults[cf.key] = cf.default; });
                  handleThemeChange({ globalSettings: { colors: defaults } });
                  toast.success('تم إعادة الألوان للافتراضي');
                }}
                className="w-full text-xs text-slate-400 hover:text-red-500 py-2 border border-dashed border-slate-200 rounded-lg hover:border-red-300 transition-colors"
              >
                ↩ إعادة الألوان للافتراضي
              </button>
            </div>
          )}

          {/* ═══ TYPOGRAPHY TAB ═══ */}
          {activeTab === 'typography' && (
            <div className="space-y-4">
              <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <Type size={15} /> الخطوط
              </h3>

              {/* Heading Font */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">خط العناوين</label>
                <select
                  value={typography.headingFont || 'Cairo'}
                  onChange={e => setTypography('headingFont', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-matgarco-200 transition"
                  style={{ fontFamily: typography.headingFont || 'Cairo' }}
                >
                  {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                </select>
                <p className="text-[10px] text-slate-400">يُستخدم في العناوين الرئيسية والأسماء</p>
              </div>

              {/* Body Font */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">خط النصوص</label>
                <select
                  value={typography.fontFamily || 'Cairo'}
                  onChange={e => setTypography('fontFamily', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-matgarco-200 transition"
                  style={{ fontFamily: typography.fontFamily || 'Cairo' }}
                >
                  {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                </select>
                <p className="text-[10px] text-slate-400">يُستخدم في النصوص والأوصاف والأزرار</p>
              </div>

              {/* Font Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">حجم الخط الأساسي</label>
                <div className="flex gap-2">
                  {FONT_SIZES.map(fs => (
                    <button
                      key={fs.id}
                      onClick={() => setTypography('fontSize', fs.id)}
                      className={clsx(
                        "flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all",
                        (typography.fontSize || 'md') === fs.id
                          ? "border-matgarco-500 bg-matgarco-50 text-matgarco-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      {fs.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direction */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 block">اتجاه الموقع</label>
                <div className="flex gap-2">
                  {[{ id: 'rtl', label: 'يمين لشمال (عربي)' }, { id: 'ltr', label: 'شمال ليمين (إنجليزي)' }].map(d => (
                    <button
                      key={d.id}
                      onClick={() => handleThemeChange({ globalSettings: { layout: { direction: d.id } } })}
                      className={clsx(
                        "flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all",
                        (gs.layout?.direction || 'rtl') === d.id
                          ? "border-matgarco-500 bg-matgarco-50 text-matgarco-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-400">معاينة الخطوط</p>
                <h4 className="text-lg font-black text-slate-900" style={{ fontFamily: `'${typography.headingFont || 'Cairo'}', sans-serif` }}>
                  عنوان تجريبي للقالب
                </h4>
                <p className="text-sm text-slate-600" style={{ fontFamily: `'${typography.fontFamily || 'Cairo'}', sans-serif` }}>
                  هذا نص تجريبي يوضح شكل خط النصوص الأساسي في المتجر. يمكنك تغيير الخط من القائمة أعلاه.
                </p>
              </div>
            </div>
          )}

          {/* ═══ SECTIONS TAB ═══ */}
          {activeTab === 'sections' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-400 mb-1.5">الصفحة</label>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value as BuilderPageId)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-matgarco-500 focus:ring-1 focus:ring-matgarco-500"
                >
                  {BUILDER_PAGES.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              <h3 className="font-black text-sm text-slate-800 flex items-center gap-2">
                <LayoutPanelLeft size={15} /> أقسام: {selectedPageMeta.label}
              </h3>
              <SectionsPanel 
                sections={themeData.pages?.[selectedPage]?.sections || []} 
                onChange={(newSections) => {
                  handleThemeChange({
                    pages: {
                      [selectedPage]: { ...(themeData.pages?.[selectedPage] || {}), sections: newSections }
                    }
                  });
                }} 
              />
            </div>
          )}

        </div>
      </aside>

      {/* ─── RIGHT WORKSPACE (Iframe Preview) ─── */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-[56px] bg-white border-b flex items-center justify-center px-4 shrink-0 shadow-sm relative z-10">
           <div className="flex items-center bg-slate-100 p-1 rounded-xl">
             <button
               onClick={() => setViewport('desktop')}
               className={clsx(
                 "w-10 h-8 rounded-lg flex items-center justify-center transition-all",
                 viewport === 'desktop' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
               )}
             ><Monitor size={16} /></button>
             <button
               onClick={() => setViewport('mobile')}
               className={clsx(
                 "w-10 h-8 rounded-lg flex items-center justify-center transition-all",
                 viewport === 'mobile' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
               )}
             ><Smartphone size={16} /></button>
           </div>
        </header>

        <div className="flex-1 flex items-center justify-center bg-[#E5E7EB] p-4 lg:p-8 overflow-hidden">
          <div 
            className={clsx(
              "bg-white shadow-2xl transition-all duration-300 ease-out origin-top border border-slate-300 rounded-lg overflow-hidden flex flex-col relative",
              viewport === 'desktop' ? "w-full h-full max-w-[1440px]" : "w-[390px] h-[844px] rounded-[2.5rem] border-[8px]"
            )}
          >
            <div className="absolute inset-x-0 top-0 h-1 pointer-events-none bg-gradient-to-r from-matgarco-400 via-purple-400 to-matgarco-400 opacity-20 animate-pulse" />
            <iframe 
              ref={iframeRef}
              src={iframeSrc}
              className="w-full flex-1 border-0"
              title="Master Theme Live Preview"
            />
          </div>
        </div>
      </main>
      
    </div>
  );
}
