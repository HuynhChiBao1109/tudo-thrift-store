import Link from "next/link";
import { ArrowRight, Leaf, RefreshCw, Star, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#003966] rounded-full flex items-center justify-center">
            <Heart size={14} className="text-white fill-white" />
          </div>
          <span
            className="text-xl font-bold text-[#003966]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            ReThread
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link
            href="/store"
            className="hover:text-[#003966] transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/store?featured=true"
            className="hover:text-[#003966] transition-colors"
          >
            Featured
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/store"
            className="text-sm px-4 py-2 bg-[#003966] text-white rounded-lg hover:bg-[#003966]/90 transition-colors"
          >
            Shop Now
          </Link>
          <Link
            href="/admin"
            className="text-sm px-3 py-2 border border-[#003966] text-[#003966] rounded-lg hover:bg-[#003966]/5 transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#003966] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full border border-white" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border border-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <Leaf size={14} />
              <span>Sustainable Fashion</span>
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Pre-loved clothes,{" "}
              <em className="italic text-amber-100">new stories</em>
            </h1>
            <p className="text-amber-50/90 text-lg mb-8 leading-relaxed">
              Discover unique second-hand fashion at unbeatable prices. Give
              clothes a second life while looking effortlessly stylish.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/store"
                className="flex items-center gap-2 bg-white text-[#003966] px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
              >
                Browse Collection <ArrowRight size={16} />
              </Link>
              <Link
                href="/store?featured=true"
                className="flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors"
              >
                Featured Picks
              </Link>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            {[
              "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80",
              "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80",
              "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80",
              "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80",
            ].map((src, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden ${i === 1 ? "mt-6" : ""} ${i === 2 ? "-mt-6" : ""}`}
              >
                <img src={src} alt="" className="w-full h-40 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Leaf,
              title: "Eco-Friendly",
              desc: "Every purchase reduces textile waste and your carbon footprint.",
            },
            {
              icon: RefreshCw,
              title: "Curated Quality",
              desc: "Every item inspected and graded by our team for condition accuracy.",
            },
            {
              icon: Star,
              title: "Unique Finds",
              desc: "Discover one-of-a-kind vintage and designer pieces at fraction of the price.",
            },
          ].map((feat) => (
            <div key={feat.title} className="text-center p-6">
              <div className="w-12 h-12 bg-[#003966]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feat.icon size={22} className="text-[#003966]" />
              </div>
              <h3
                className="font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {feat.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-50/60 py-16">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2
            className="text-3xl font-bold text-[#003966] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to find your next favourite piece?
          </h2>
          <p className="text-gray-500 mb-8">
            New arrivals added every week. Shop before they're gone.
          </p>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 bg-[#003966] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#003966]/90 transition-colors text-lg"
          >
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
        <p>© 2024 ReThread. Sustainable fashion for everyone.</p>
      </footer>
    </div>
  );
}
