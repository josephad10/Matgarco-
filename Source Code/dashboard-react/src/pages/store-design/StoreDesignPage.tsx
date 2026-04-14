'use client';

import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { themeAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import {
  Loader2, Globe, RotateCcw, Smartphone, Monitor, Tablet, ExternalLink,
  Store, LayoutTemplate, Palette, Type, Layers, SearchCode, Share2,
  RefreshCw, Signal, Wifi, Battery, Lock,
} from 'lucide-react';
import TemplatePanel from './panels/TemplatePanel';
import ColorsPanel from './panels/ColorsPanel';
import TypographyPanel from './panels/TypographyPanel';
import SectionsPanel from './panels/SectionsPanel';
import SeoPanel from './panels/SeoPanel';
import SocialPanel from './panels/SocialPanel';
import StoreInfoPanel from './panels/StoreInfoPanel';

// Shallow-merge draft: for each key in update, if both sides are plain objects, merge one level deep
function shallowMergeDraft(draft: Record<string, any>, update: Record<string, any>): Record<string, any> {
  const result = { ...draft };
  for (const key of Object.keys(update)) {
    if (update[key] && typeof update[key] === 'object' && !Array.isArray(update[key])
        && draft[key] && typeof draft[key] === 'object' && !Array.isArray(draft[key])) {
      result[key] = { ...draft[key], ...update[key] };
    } else {
      result[key] = update[key];
    }
  }
  return result;
}

const TABS = [
  { id: 'store',      label: 'المتجر',   Icon: Store         },
  { id: 'template',   label: 'القالب',   Icon: LayoutTemplate },
  { id: 'colors',     label: 'الألوان',  Icon: Palette        },
  { id: 'typography', label: 'الخط',     Icon: Type           },
  { id: 'sections',   label: 'الأقسام', Icon: Layers         },
  { id: 'seo',        label: 'SEO',      Icon: SearchCode     },
  { id: 'social',     label: 'التواصل', Icon: Share2         },
];

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export default function StoreDesignPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [activeTab, setActiveTab] = useState('store');
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  // The subdomain comes from the merchant's account
  const subdomain = user?.subdomain || 'demo-store';
  const previewURL = `${import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:3001'}/store/${subdomain}?preview=1`;

  const { data: themeData, isLoading } = useQuery({
    queryKey: ['theme'],
    queryFn: () => themeAPI.get().then((r) => r.data.data),
    staleTime: 30_000,
  });

  const draft = themeData?.draft || themeData?.published || {};

  const saveDraftMutation = useMutation({
    mutationFn: (update: Record<string, any>) => themeAPI.saveDraft(update),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['theme'] });
      refreshPreviewDebounced();   // debounced — avoids iframe reload on every keystroke
    },
    onError: () => toast.error('فشل حفظ التغييرات'),
  });

  const publishMutation = useMutation({
    mutationFn: () => themeAPI.publish(),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ['theme'] });
      toast.success('\u2705 تم نشر التغييرات بنجاح!');
      // Bust storefront server cache so published site updates immediately
      try {
        const sfUrl = import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:3001';
        await fetch(`${sfUrl}/api/revalidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subdomain }),
        });
      } catch { /* ignore revalidation errors */ }
      refreshPreview();
    },
    onError: () => toast.error('فشل نشر التغييرات'),
  });

  const resetMutation = useMutation({
    mutationFn: () => themeAPI.resetDraft(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['theme'] });
      toast.info('تم التراجع عن التغييرات');
      refreshPreview();
    },
  });

  const refreshPreview = useCallback(() => {
    if (iframeRef.current) {
      const base = previewURL.split('&_t=')[0];
      iframeRef.current.src = `${base}&_t=${Date.now()}`;
    }
  }, [previewURL]);

  // Debounced preview refresh — avoids reloading iframe on every save (e.g. while typing)
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const refreshPreviewDebounced = useCallback(() => {
    clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => refreshPreview(), 1500);
  }, [refreshPreview]);

  // Optimistic update: immediately merge changes into local cache.
  // Actual API save is debounced to reduce network calls while typing.
  const pendingUpdateRef = useRef<Record<string, any>>({});
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = useCallback((update: Record<string, any>) => {
    // Calculate new merged state based on local cache
    const old = qc.getQueryData(['theme']) as any;
    if (!old) return;
    
    const currentDraft = old.draft || old.published || {};
    const merged = shallowMergeDraft(currentDraft, update);

    // 1. Send live preview update to iframe instantly over active link
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'STORE_THEME_UPDATE', payload: merged },
        '*'
      );
    }

    // 2. Optimistic UI update
    qc.setQueryData(['theme'], (oldData: any) => {
      if (!oldData) return oldData;
      return { ...oldData, draft: merged };
    });

    // 3. Accumulate API payload and debounce saving to the server
    pendingUpdateRef.current = shallowMergeDraft(pendingUpdateRef.current, update);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const toSave = pendingUpdateRef.current;
      pendingUpdateRef.current = {};
      saveDraftMutation.mutate(toSave);
    }, 400);
  }, [qc, saveDraftMutation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* ─── Sidebar ─────────────────────────────── */}
      <aside className="w-72 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        {/* Tab nav */}
        <div className="border-b border-gray-100 overflow-x-auto">
          <div className="flex p-2 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`flex-shrink-0 flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl text-[10px] font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                <tab.Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'store'      && <StoreInfoPanel draft={draft} onChange={handleChange} />}
          {activeTab === 'template'   && <TemplatePanel draft={draft} onChange={handleChange} subdomain={subdomain} onRefresh={refreshPreview} />}
          {activeTab === 'colors'     && <ColorsPanel draft={draft} onChange={handleChange} />}
          {activeTab === 'typography' && <TypographyPanel draft={draft} onChange={handleChange} />}
          {activeTab === 'sections'   && <SectionsPanel draft={draft} onChange={handleChange} />}
          {activeTab === 'seo'        && <SeoPanel draft={draft} onChange={handleChange} />}
          {activeTab === 'social'     && <SocialPanel draft={draft} onChange={handleChange} />}
        </div>

        {/* Actions bar */}
        <div className="border-t border-gray-100 p-3 space-y-2">
          <button
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {publishMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            نشر التغييرات
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => resetMutation.mutate()}
              disabled={resetMutation.isPending}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              تراجع
            </button>
            <a
              href={`${import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:3001'}/store/${subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              متجري
            </a>
          </div>
        </div>
      </aside>

      {/* ─── Preview ─────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {([['desktop', <Monitor key="m" className="w-4 h-4" />], ['tablet', <Tablet key="t" className="w-4 h-4" />], ['mobile', <Smartphone key="s" className="w-4 h-4" />]] as const).map(([size, icon]) => (
              <button
                key={size}
                onClick={() => setViewport(size)}
                className={`p-1.5 rounded-md transition-all ${viewport === size ? 'bg-white shadow text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {saveDraftMutation.isPending && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                حفظ...
              </div>
            )}
            <button
              onClick={refreshPreview}
              className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              title="تحديث المعاينة"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-mono">
            {subdomain}.matgarco.com
          </div>
        </div>

        {/* iframe wrapper with device frame */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-6">
          {viewport === 'mobile' ? (
            <PhoneFrame>
              <iframe ref={iframeRef} src={previewURL} className="w-full h-full border-none" title="متجر المعاينة" />
            </PhoneFrame>
          ) : viewport === 'tablet' ? (
            <TabletFrame>
              <iframe ref={iframeRef} src={previewURL} className="w-full h-full border-none" title="متجر المعاينة" />
            </TabletFrame>
          ) : (
            <BrowserFrame subdomain={subdomain}>
              <iframe ref={iframeRef} src={previewURL} className="w-full h-full border-none" title="متجر المعاينة" />
            </BrowserFrame>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   Device Frames
   ═══════════════════════════════════════════════════════════════════════════════ */

/* ── Phone (iPhone-style) ───────────────────────────────────────────────────── */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center transition-all duration-300">
      {/* Outer shell */}
      <div
        className="relative bg-[#1a1a1a] rounded-[3rem] p-[12px] shadow-2xl"
        style={{ width: 390 + 24, height: 844 + 24, maxHeight: 'calc(100vh - 180px)' }}
      >
        {/* Left buttons */}
        <div className="absolute -left-[3px] top-[120px] w-[3px] h-[30px] bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute -left-[3px] top-[170px] w-[3px] h-[55px] bg-[#2a2a2a] rounded-l-sm" />
        <div className="absolute -left-[3px] top-[235px] w-[3px] h-[55px] bg-[#2a2a2a] rounded-l-sm" />
        {/* Right button */}
        <div className="absolute -right-[3px] top-[170px] w-[3px] h-[80px] bg-[#2a2a2a] rounded-r-sm" />

        {/* Screen area */}
        <div className="relative w-full h-full bg-white rounded-[2.4rem] overflow-hidden">
          {/* Status bar */}
          <div className="relative z-10 flex items-center justify-between px-7 pt-3 pb-1 bg-white">
            <span className="text-[11px] font-semibold text-gray-900 tabular-nums">9:41</span>
            {/* Dynamic Island */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full" />
            <div className="flex items-center gap-1">
              <Signal className="w-3.5 h-3.5 text-gray-900" />
              <Wifi className="w-3.5 h-3.5 text-gray-900" />
              <Battery className="w-4.5 h-3.5 text-gray-900" />
            </div>
          </div>

          {/* Content */}
          <div className="w-full" style={{ height: 'calc(100% - 40px)' }}>
            {children}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-gray-900/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ── Tablet (iPad-style) ────────────────────────────────────────────────────── */
function TabletFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center transition-all duration-300">
      <div
        className="relative bg-[#1a1a1a] rounded-[1.8rem] p-[14px] shadow-2xl"
        style={{ width: 768 + 28, maxHeight: 'calc(100vh - 160px)', height: 1024 + 28 }}
      >
        {/* Camera dot */}
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] bg-[#2a2a2a] rounded-full border border-[#333]" />

        {/* Screen area */}
        <div className="relative w-full h-full bg-white rounded-[1.2rem] overflow-hidden">
          {/* Status bar */}
          <div className="relative z-10 flex items-center justify-between px-5 pt-2 pb-1 bg-white border-b border-gray-100">
            <span className="text-[11px] font-semibold text-gray-800">9:41</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3 h-3 text-gray-700" />
              <Battery className="w-4 h-3 text-gray-700" />
            </div>
          </div>

          {/* Content */}
          <div className="w-full" style={{ height: 'calc(100% - 32px)' }}>
            {children}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-gray-900/15 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ── Desktop browser chrome ─────────────────────────────────────────────────── */
function BrowserFrame({ children, subdomain }: { children: React.ReactNode; subdomain: string }) {
  return (
    <div
      className="flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-300"
      style={{ width: '100%', height: '100%', minHeight: 600 }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#DEA123]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29]" />
        </div>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 mx-8">
          <Lock className="w-3 h-3 text-green-600 flex-shrink-0" />
          <span className="text-xs text-gray-500 font-mono truncate">
            https://{subdomain}.matgarco.com
          </span>
        </div>

        {/* Spacer to balance */}
        <div className="w-[52px] flex-shrink-0" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
