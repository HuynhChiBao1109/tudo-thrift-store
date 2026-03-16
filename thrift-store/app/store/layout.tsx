import { StoreNav } from '@/components/layout/StoreNav';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <StoreNav />
      <main>{children}</main>
      <footer className="border-t border-gray-100 mt-16 py-8 text-center text-gray-400 text-sm">
        <p>© 2024 ReThread. Sustainable fashion for everyone.</p>
      </footer>
    </div>
  );
}
