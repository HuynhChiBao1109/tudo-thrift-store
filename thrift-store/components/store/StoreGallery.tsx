import { GALLERY_ITEMS } from "@/lib/storeContent";

interface StoreGalleryProps {
  title?: string;
  compact?: boolean;
  id?: string;
}

export function StoreGallery({ title = "Gallery", compact = false, id }: StoreGalleryProps) {
  return (
    <section id={id} className={compact ? "mt-8" : "mt-10"}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-[#111111]">{title}</h2>
        <span className="text-xs text-[#747F86]">Tudo4NoReason</span>
      </div>

      <div className={compact ? "grid grid-cols-3 gap-2" : "grid grid-cols-1 md:grid-cols-3 gap-3"}>
        {GALLERY_ITEMS.map((item) => (
          <div key={item.src} className="rounded-lg overflow-hidden border border-[#d4d6d9] bg-white">
            <img
              src={item.src}
              alt={item.alt}
              className={compact ? "h-24 w-full object-cover" : "h-36 w-full object-cover"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
