import { StoreNav } from "@/components/layout/StoreNav";
import { BRAND_NAME, BRAND_TAGLINE, LANDING_HERO } from "@/lib/storeContent";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone } from "lucide-react";

export default function HomePage() {
  const heroCards = [
    {
      image: LANDING_HERO.images[0],
      alt: "Tudo4NoReason hero look",
      eyebrow: LANDING_HERO.badge,
      title: "Vintage denim",
      subtitle: "Curated thrift pieces with washed tones, old-school attitude and everyday wearability.",
      meta: "Drop 04 · Tudo Archive",
      large: true,
      align: "bottom-left",
    },
    {
      image: LANDING_HERO.images[1],
      alt: "Tudo4NoReason second look",
      eyebrow: "Street vintage",
      title: "Soft fade",
      subtitle: "Easy layers, worn textures and a quiet retro mood.",
      meta: "Selected pieces",
      large: false,
      align: "top-left",
    },
    {
      image: LANDING_HERO.images[2],
      alt: "Tudo4NoReason third look",
      eyebrow: LANDING_HERO.saleText,
      title: "No reason needed",
      subtitle: "Handpicked one-off finds for people who dress by feeling.",
      meta: "Limited stock",
      large: false,
      align: "bottom-left",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-white">
      <StoreNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <article className="vintage-hero-card md:col-span-2 h-[340px] sm:h-[520px]">
              <img src={heroCards[0].image} alt={heroCards[0].alt} className="vintage-hero-image" />
              <div className="vintage-hero-overlay" />
              <div className="vintage-hero-noise" />
              <div className="vintage-hero-content vintage-hero-content--bottom">
                <span className="vintage-hero-eyebrow">{heroCards[0].eyebrow}</span>
                <h1 className="vintage-hero-title text-4xl sm:text-6xl max-w-md">{heroCards[0].title}</h1>
                <p className="vintage-hero-subtitle max-w-md">{heroCards[0].subtitle}</p>
                <div className="vintage-hero-meta">{heroCards[0].meta}</div>
              </div>
            </article>

            <div className="grid grid-rows-2 gap-3">
              <article className="vintage-hero-card h-[170px] sm:h-[252px]">
                <img src={heroCards[1].image} alt={heroCards[1].alt} className="vintage-hero-image" />
                <div className="vintage-hero-overlay vintage-hero-overlay--light" />
                <div className="vintage-hero-noise" />
                <div className="vintage-hero-content vintage-hero-content--top">
                  <span className="vintage-hero-eyebrow">{heroCards[1].eyebrow}</span>
                  <h2 className="vintage-hero-title text-2xl sm:text-3xl">{heroCards[1].title}</h2>
                  <p className="vintage-hero-subtitle text-xs sm:text-sm max-w-[16rem]">{heroCards[1].subtitle}</p>
                  <div className="vintage-hero-meta">{heroCards[1].meta}</div>
                </div>
              </article>

              <article className="vintage-hero-card h-[170px] sm:h-[252px]">
                <img src={heroCards[2].image} alt={heroCards[2].alt} className="vintage-hero-image" />
                <div className="vintage-hero-overlay" />
                <div className="vintage-hero-noise" />
                <div className="vintage-hero-content vintage-hero-content--bottom">
                  <span className="vintage-hero-eyebrow">{heroCards[2].eyebrow}</span>
                  <h2 className="vintage-hero-title text-2xl sm:text-3xl">{heroCards[2].title}</h2>
                  <p className="vintage-hero-subtitle text-xs sm:text-sm max-w-[16rem]">{heroCards[2].subtitle}</p>
                  <div className="vintage-hero-meta">{heroCards[2].meta}</div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="mt-10 sm:mt-14 max-w-2xl">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center rounded-full bg-[#747F86]/15 text-[#747F86] px-3 py-1 text-xs font-medium">
              {LANDING_HERO.badge}
            </span>
            <span className="inline-flex items-center rounded-full bg-[#78511D]/15 text-[#78511D] px-3 py-1 text-xs font-medium">
              {LANDING_HERO.saleText}
            </span>
          </div>

          <h1 className="vintage-header text-3xl sm:text-4xl text-[#111111] leading-tight">
            Vintage denim.
            <br />
            No reason needed.
          </h1>

          <p className="text-gray-500 text-sm mt-4 leading-relaxed">
            Tudo4NoReason là nơi tổng hợp những món đồ denim & vintage được chọn lọc kỹ — mỗi đợt drop là một bộ sưu tập
            mới, số lượng có hạn. Mặc vì bạn thích, không cần lý do.
          </p>

          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            Từng món được đánh giá tình trạng và cắt tags thủ công trước khi lên sàn. Chất lượng thật, giá hợp lý, không
            fake.
          </p>
        </section>

        {/* Divider values */}
        <section className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#e9ecef] pt-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#747F86] mb-1">Curated drops</p>
            <p className="text-sm text-gray-600">Mỗi đợt chỉ vài chục món, ra hàng theo lịch drop không định kỳ.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#78511D] mb-1">Real vintage</p>
            <p className="text-sm text-gray-600">Denim</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[#747F86] mb-1">Honest pricing</p>
            <p className="text-sm text-gray-600">
              Giá phản ánh đúng tình trạng thực tế — không thổi phồng, không giả giảm.
            </p>
          </div>
        </section>
      </main>

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
