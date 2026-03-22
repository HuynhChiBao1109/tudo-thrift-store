import { StoreNav } from "@/components/layout/StoreNav";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f2e8]">
      <StoreNav />
      <main>{children}</main>
      <footer className="border-t border-[#dfd2bd] mt-16 py-8 text-center text-gray-500 text-sm bg-[#fffaf1]">
        <p>© 2024 ReThread. Sustainable fashion for everyone.</p>
      </footer>
    </div>
  );
}
