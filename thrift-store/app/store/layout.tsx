import { StoreNav } from "@/components/layout/StoreNav";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/storeContent";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone } from "lucide-react";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#ffffff]">
      <StoreNav />
      <main>{children}</main>
      <footer className="border-t border-[#d4d6d9] mt-14 py-8 bg-[#ffffff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
            <div>
              <p className="brand-font text-base text-[#111111]">{BRAND_NAME}</p>
              <p className="text-xs text-[#78511D] mt-1">{BRAND_TAGLINE}</p>

              <div className="mt-4 space-y-3 text-sm">
                <p className="flex items-center gap-3">
                  <Phone size={15} className="text-[#747F86]" />
                  <a href="tel:+84901234567" className="hover:text-[#111111] transition-colors">
                    +84 901 234 567
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Mail size={15} className="text-[#747F86]" />
                  <a href="mailto:hello@tudo4noreason.com" className="hover:text-[#111111] transition-colors">
                    hello@tudo4noreason.com
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <MapPin size={15} className="text-[#747F86]" />
                  <span>Ho Chi Minh City, Vietnam</span>
                </p>
              </div>
            </div>

            <div className="md:text-right">
              <p className="vintage-header text-base text-[#111111]">Follow us</p>
              <div className="mt-4 flex flex-col items-start md:items-end gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 w-full md:w-52 px-4 py-2.5 rounded-lg border border-[#d4d6d9] bg-white hover:border-[#747F86] hover:text-[#111111] transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#e4e7ea]">
                    <Instagram size={18} />
                  </span>
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 w-full md:w-52 px-4 py-2.5 rounded-lg border border-[#d4d6d9] bg-white hover:border-[#747F86] hover:text-[#111111] transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#e4e7ea]">
                    <Music2 size={18} />
                  </span>
                  TikTok
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 w-full md:w-52 px-4 py-2.5 rounded-lg border border-[#d4d6d9] bg-white hover:border-[#747F86] hover:text-[#111111] transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#e4e7ea]">
                    <Facebook size={18} />
                  </span>
                  Facebook
                </a>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 w-full md:w-52 px-4 py-2.5 rounded-lg border border-[#d4d6d9] bg-white hover:border-[#747F86] hover:text-[#111111] transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-[#e4e7ea]">
                    <MessageCircle size={18} />
                  </span>
                  Zalo
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#eceef0] text-xs text-gray-500 text-center md:text-left">
            © 2026 {BRAND_NAME} · {BRAND_TAGLINE}
          </div>
        </div>
      </footer>
    </div>
  );
}
