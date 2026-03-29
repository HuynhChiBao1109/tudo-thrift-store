import Link from "next/link";
import { ArrowLeft, Flower2, Sparkles } from "lucide-react";
import { StoreGallery } from "@/components/store/StoreGallery";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/storeContent";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/store" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#747F86] mb-8">
        <ArrowLeft size={16} />
        Back to store
      </Link>

      <div className="street-card rounded-2xl p-8">
        <div className="inline-flex items-center gap-2 rounded-md bg-[#747F86]/10 px-3 py-1.5 text-xs text-[#747F86] mb-4">
          <Flower2 size={16} />
          About Us
        </div>

        <h1 className="vintage-header text-2xl sm:text-3xl font-semibold text-[#111111] mb-2">{BRAND_NAME}</h1>
        <p className="text-sm text-[#78511D] mb-4">{BRAND_TAGLINE}</p>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Tudo4Noreason là một thrift space cho người thích đồ vintage dễ mặc mỗi ngày. We curate second-hand fashion
          that feels expressive, affordable, and sustainable.
        </p>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Every product is selected with care so you can style confidently while giving great clothes a new life. Thank
          you for shopping thoughtfully with us.
        </p>

        <div className="inline-flex items-center gap-2 text-sm text-[#78511D] font-medium">
          <Sparkles size={16} />
          Keep it vintage. Keep it fun.
        </div>

        <StoreGallery id="gallery" title="About Gallery" compact />
      </div>
    </div>
  );
}
