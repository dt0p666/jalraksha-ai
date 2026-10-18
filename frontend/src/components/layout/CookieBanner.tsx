import React from 'react';
import { useApp } from '../../state/appStore';
import { ShieldCheck } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const { cookieConsent, setCookieConsent } = useApp();

  if (cookieConsent !== null) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 p-4 bg-[#141E3D] border-t border-[#425B9A]/40 text-[#EAF1F8] shadow-2xl cookie-banner"
      role="region"
      aria-label="Storage and Privacy notice"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-[#425B9A]/30 text-[#76C0EC] shrink-0 mt-0.5">
            <ShieldCheck size={18} />
          </div>
          <p className="text-xs sm:text-sm text-[#9FB0C9] leading-relaxed">
            We store your chosen theme and intro preference locally on this device.
            We do not run third-party trackers, external analytics, or commercial advertising cookies.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setCookieConsent('declined')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-[#9FB0C9] hover:text-[#EAF1F8] hover:bg-[#1D2A52] transition-colors"
          >
            Session only
          </button>
          <button
            onClick={() => setCookieConsent('accepted')}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#425B9A] text-white hover:bg-[#4f6cb6] border border-[#76C0EC]/40 transition-colors shadow-sm"
          >
            Remember settings
          </button>
        </div>
      </div>
    </div>
  );
};
