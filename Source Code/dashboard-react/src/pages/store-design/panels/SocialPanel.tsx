import {
  Instagram, Twitter, Facebook, Music2, Youtube, MessageCircle,
} from 'lucide-react';

interface Props {
  draft: any;
  onChange: (update: Record<string, any>) => void;
}

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram',   Icon: Instagram,     color: '#E4405F', placeholder: 'https://instagram.com/yourstore' },
  { key: 'twitter',   label: 'X / Twitter', Icon: Twitter,       color: '#000000', placeholder: 'https://x.com/yourstore' },
  { key: 'facebook',  label: 'Facebook',    Icon: Facebook,      color: '#1877F2', placeholder: 'https://facebook.com/yourstore' },
  { key: 'tiktok',    label: 'TikTok',      Icon: Music2,        color: '#000000', placeholder: 'https://tiktok.com/@yourstore' },
  { key: 'youtube',   label: 'YouTube',     Icon: Youtube,       color: '#FF0000', placeholder: 'https://youtube.com/@yourstore' },
  { key: 'whatsapp',  label: 'WhatsApp',    Icon: MessageCircle, color: '#25D366', placeholder: 'https://wa.me/201XXXXXXXXX' },
];

export default function SocialPanel({ draft, onChange }: Props) {
  const social = draft?.social || {};
  const set = (key: string, val: string) => onChange({ social: { ...social, [key]: val } });

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-sm text-gray-800">التواصل الاجتماعي</h3>
      <p className="text-xs text-gray-400">الروابط تظهر في تذييل المتجر</p>
      <div className="space-y-3">
        {PLATFORMS.map(({ key, label, Icon, color, placeholder }) => (
          <div key={key} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus-within:border-indigo-400 transition-all">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-500 mb-0.5">{label}</p>
              <input
                value={social[key] || ''}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full outline-none text-[11px] text-gray-700 bg-transparent"
                dir="ltr"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
