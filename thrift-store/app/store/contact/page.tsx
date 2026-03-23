import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/store" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#003966] mb-8">
        <ArrowLeft size={16} />
        Back to store
      </Link>

      <div className="rounded-2xl border border-[#dfd2bd] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[#003966] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Contact
        </h1>
        <p className="text-gray-600 mb-6">Need help with your order or product details? Reach out to us.</p>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-[#003966]" />
            <span>+84 901 234 567</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={16} className="text-[#003966]" />
            <span>hello@tudo4noreason.com</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-[#003966]" />
            <span>Ho Chi Minh City, Vietnam</span>
          </div>
        </div>
      </div>
    </div>
  );
}
