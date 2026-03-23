import Link from "next/link";
import { ArrowLeft, Flower2, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/store" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#003966] mb-8">
        <ArrowLeft size={16} />
        Back to store
      </Link>

      <div className="rounded-2xl border border-[#dfd2bd] bg-[#fffdf8] p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#003966]/10 px-4 py-1.5 text-sm text-[#003966] mb-4">
          <Flower2 size={14} />
          About Us
        </div>

        <h1 className="text-3xl font-bold text-[#003966] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Vintage souls, modern comfort
        </h1>

        <p className="text-gray-600 leading-relaxed mb-4">
          Tudo4Noreason is a playful thrift space for people who love timeless pieces with a chill mood. We curate
          second-hand fashion that feels expressive, affordable, and sustainable.
        </p>

        <p className="text-gray-600 leading-relaxed mb-6">
          Every product is selected with care so you can style confidently while giving great clothes a new life. Thank
          you for shopping thoughtfully with us.
        </p>

        <div className="inline-flex items-center gap-2 text-sm text-[#003966] font-medium">
          <Sparkles size={14} />
          Keep it vintage. Keep it fun.
        </div>
      </div>
    </div>
  );
}
