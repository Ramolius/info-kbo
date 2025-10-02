'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  let currentPage = 'other';
  
  if (pathname === '/' || pathname === '/rankings') {
    currentPage = 'rank';
  } else if (pathname === '/news') {
    currentPage = 'news';
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header currentPage={currentPage} />
      <div className="flex-grow overflow-hidden">
        <main className="max-h-[calc(100vh-150px)] max-w-7xl mx-auto w-full px-4 pt-2 pb-0 overflow-y-auto">
          {children}
        </main>
      </div>
      <Footer className="mt-0" />
    </div>
  );
}