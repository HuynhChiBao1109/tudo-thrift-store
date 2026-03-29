import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { StoreGallery } from "@/components/store/StoreGallery";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/store" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#747F86] mb-8">
        <ArrowLeft size={16} />
        Back to store
      </Link>

      <div className="street-card rounded-2xl p-8">
        <h1 className="vintage-header text-2xl sm:text-3xl font-semibold text-[#111111] mb-4">Contact</h1>
        <p className="text-gray-600 text-sm mb-6">Need help with your order or product details? Reach out to us.</p>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-[#747F86]" />
            <span>+84 901 234 567</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-[#747F86]" />
            <span>hello@tudo4noreason.com</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-[#747F86]" />
            <span>Ho Chi Minh City, Vietnam</span>
          </div>
        </div>

        <StoreGallery id="gallery" title="Contact Gallery" compact />
      </div>
    </div>
  );
}
