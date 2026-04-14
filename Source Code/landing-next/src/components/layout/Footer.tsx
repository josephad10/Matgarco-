"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="inline-block mb-6">
            <Image src="/logo.png" alt="Matgarco Logo" width={140} height={45} className="object-contain" />
          </Link>
          <p className="text-slate-500 leading-relaxed mb-6">{t.footer.description}</p>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-lg mb-6">{t.footer.platform}</h3>
          <ul className="space-y-4 text-slate-600">
            <li><Link href="/features" className="hover:text-matgarco-600 transition-colors">{t.footer.features}</Link></li>
            <li><Link href="/pricing" className="hover:text-matgarco-600 transition-colors">{t.footer.pricing}</Link></li>
            <li><Link href="/themes" className="hover:text-matgarco-600 transition-colors">{t.footer.themes}</Link></li>
            <li><Link href="/integrations" className="hover:text-matgarco-600 transition-colors">{t.footer.integrations}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-lg mb-6">{t.footer.resources}</h3>
          <ul className="space-y-4 text-slate-600">
            <li><Link href="/blog" className="hover:text-matgarco-600 transition-colors">{t.footer.blog}</Link></li>
            <li><Link href="/help" className="hover:text-matgarco-600 transition-colors">{t.footer.help}</Link></li>
            <li><Link href="/api" className="hover:text-matgarco-600 transition-colors">{t.footer.api}</Link></li>
            <li><Link href="/partners" className="hover:text-matgarco-600 transition-colors">{t.footer.partners}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-lg mb-6">{t.footer.contact}</h3>
          <ul className="space-y-4 text-slate-600">
            <li><a href="mailto:support@matgarco.com" className="hover:text-matgarco-600 transition-colors">support@matgarco.com</a></li>
            <li className="text-sm border border-slate-200 p-4 rounded-lg bg-white mt-4">
              <span className="block font-bold text-slate-900 mb-2">{t.footer.supportAvailable}</span>
              {t.footer.supportDesc}
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Matgarco. {t.footer.rights}</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-matgarco-600">{t.footer.privacy}</Link>
          <Link href="/terms" className="hover:text-matgarco-600">{t.footer.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
