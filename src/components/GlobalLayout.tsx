'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GlobalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState('rank');

  useEffect(() => {
    if (pathname === '/' || pathname === '/rankings') {
      setCurrentPage('rank');
    } else if (pathname === '/news') {
      setCurrentPage('news');
    } else {
      setCurrentPage('other');
    }
  }, [pathname]);

  return (
    <>
      <Header currentPage={currentPage} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}