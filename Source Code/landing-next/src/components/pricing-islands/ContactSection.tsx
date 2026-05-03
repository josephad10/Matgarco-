"use client";

import { useState, useEffect, FormEvent } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

/**
 * ContactSection — Phase 13: Step 5 (Enterprise Contact System - UI Overhaul)
 *
 * Architectural Justification:
 * - Pillar 6 (UX/UI): A stark, high-contrast White Form floating on a pure Black 
 *   background, adhering to Shopify's enterprise aesthetic.
 * - Resilience (Idempotency): Generates a unique UUID on mount and sends it as 
 *   `x-idempotency-key` to prevent duplicate DB entries.
 */
export function ContactSection() {
  const { t, lang } = useLanguage();
  const contactDict = t.pricingPage?.contactSection;
  const isRtl = lang === "ar";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formErrors, setFormErrors] = useState<{name?: boolean, email?: boolean, message?: boolean}>({});
  const [backendErrorMsg, setBackendErrorMsg] = useState<string | null>(null);

  // Generate unique idempotency key on mount
  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, []);

  if (!contactDict) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 1. Strict Client-Side Validation
    const errors = {
      name: formData.name.trim().length < 2,
      email: !/^\S+@\S+\.\S+$/.test(formData.email),
      message: formData.message.trim().length < 10,
    };

    setFormErrors(errors);

    // If any required field is invalid, STOP and show error.
    if (errors.name || errors.email || errors.message) {
      setSubmitStatus("error"); // Will prompt user to fill highlighted fields
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": idempotencyKey,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      });

      // CRITICAL FIX: Handle non-JSON (HTML 404/500) responses from Express
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server returned non-JSON response. Route likely not mounted or server down. Status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        // Handle Rate Limiting (DOS Protection)
        if (response.status === 429) {
          throw new Error(lang === "ar" ? "لقد تجاوزت الحد المسموح به. يرجى المحاولة بعد 15 دقيقة." : "Rate limit exceeded. Please try again later.");
        }

        throw new Error(data.message || "Backend rejected the submission.");
      }

      // SUCCESS LOGIC
      setSubmitStatus("success");
      setBackendErrorMsg(null);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setFormErrors({});
      setIdempotencyKey(crypto.randomUUID()); // Reset Idempotent Key
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      // Fallback message points directly to infrastructure issues
      setBackendErrorMsg(message === "Failed to fetch" ? "Network Error: Is the Node.js backend running on port 5000?" : message);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-transparent py-24 px-4 w-full" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        
        {/* ── MAIN HEADERS (ABOVE GRID) ── */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            {contactDict.mainTitle}
          </h2>
          <p className="text-xl text-gray-400">
            {contactDict.mainSubtitle}
          </p>
        </div>

        {/* ── 2-COLUMN LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* LEFT COLUMN: WHITE FORM CONTAINER */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 text-[#050505] shadow-2xl">
            <div className="mb-8">
              <h3 className="text-3xl font-black mb-2">{contactDict.formTitle}</h3>
              <p className="text-gray-500 font-medium">{contactDict.formSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                  {contactDict.labels.name}
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder={contactDict.placeholders.name}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: false });
                  }}
                  className={`w-full bg-gray-50 border ${formErrors.name ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus:border-[#000080] focus:ring-[#000080]"} text-black placeholder:text-gray-400 rounded-xl px-5 py-4 focus:outline-none focus:ring-1 transition-colors`}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  {contactDict.labels.email}
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder={contactDict.placeholders.email}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: false });
                  }}
                  className={`w-full bg-gray-50 border ${formErrors.email ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus:border-[#000080] focus:ring-[#000080]"} text-black placeholder:text-gray-400 rounded-xl px-5 py-4 focus:outline-none focus:ring-1 transition-colors`}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                  {contactDict.labels.phone}
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder={contactDict.placeholders.phone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 rounded-xl px-5 py-4 focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                  {contactDict.labels.message}
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder={contactDict.placeholders.message}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (formErrors.message) setFormErrors({ ...formErrors, message: false });
                  }}
                  className={`w-full bg-gray-50 border ${formErrors.message ? "border-red-500 ring-1 ring-red-500" : "border-gray-200 focus:border-[#000080] focus:ring-[#000080]"} text-black placeholder:text-gray-400 rounded-xl px-5 py-4 focus:outline-none focus:ring-1 transition-colors resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#000080] text-white font-bold text-lg py-4 rounded-full hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? contactDict.labels.sending : contactDict.labels.send}
              </button>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-bold text-center">
                  {contactDict.success}
                </div>
              )}
              {submitStatus === "error" && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold text-center">
                  {backendErrorMsg || contactDict.error}
                </div>
              )}
            </form>
          </div>

          {/* RIGHT COLUMN: INFO & MAP */}
          <div className="flex flex-col space-y-12 justify-center">
            
            {/* Info Grid with Icons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Address */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#000080]">
                  <MapPin className="w-6 h-6" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    {contactDict.info.addressTitle}
                  </h4>
                </div>
                <p className="text-white font-medium text-lg leading-relaxed">
                  {contactDict.info.address}
                </p>
              </div>
              
              {/* Phone/Email */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#000080]">
                  <Phone className="w-6 h-6" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    {contactDict.info.phoneTitle}
                  </h4>
                </div>
                <div className="text-white font-medium text-lg flex flex-col space-y-1">
                  <span>{contactDict.info.tel}</span>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{contactDict.info.email}</span>
                  </div>
                </div>
              </div>

              {/* Digital Presence */}
              <div className="md:col-span-2 flex flex-col space-y-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-[#000080]">
                  <Globe className="w-6 h-6" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    {contactDict.info.webTitle}
                  </h4>
                </div>
                <p className="text-[#3B82F6] font-bold text-lg">
                  {contactDict.info.website}
                </p>
              </div>

            </div>

            {/* Interactive Map (Hover un-grayscales) */}
            <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden filter grayscale transition-all duration-500 hover:grayscale-0 border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.63414002626!2d31.2721833!3d29.9612301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458380e22467d5d%3A0xc6cba4c10756e180!2s12%20Badr%20Buildings%2C%20Maadi%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Matgarco Headquarters"
              ></iframe>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
