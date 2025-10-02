'use client';

import { useState } from 'react';
import Link from 'next/link';
import OffCanvasMenu from './OffCanvasMenu';

interface HeaderProps {
  currentPage?: string; // 현재 페이지 정보 (순위, 뉴스 등)
}

export default function Header({ currentPage = 'rank' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button 
                className="md:hidden mr-4 text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">KBO Info</h1>
            </div>
            
            {/* 데스크톱 메뉴 */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/rankings" className={`font-medium ${currentPage === 'rank' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>순위</Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600">경기일정</Link>
              <Link href="#" className="text-gray-600 hover:text-blue-600">선수정보</Link>
              <Link href="/news" className={`font-medium ${currentPage === 'news' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>뉴스</Link>
            </nav>
          </div>
        </div>
      </header>
      
      {/* 오프캔버스 메뉴 */}
      <OffCanvasMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">메뉴</h2>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="space-y-4">
            <Link href="/rankings" className={`block py-3 text-lg font-medium border-b border-gray-100 ${currentPage === 'rank' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} onClick={() => setMobileMenuOpen(false)}>순위</Link>
            <Link href="#" className="block py-3 text-lg text-gray-600 hover:text-blue-600 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>경기일정</Link>
            <Link href="#" className="block py-3 text-lg text-gray-600 hover:text-blue-600 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>선수정보</Link>
            <Link href="/news" className={`block py-3 text-lg font-medium border-b border-gray-100 ${currentPage === 'news' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`} onClick={() => setMobileMenuOpen(false)}>뉴스</Link>
          </nav>
        </div>
      </OffCanvasMenu>
    </>
  );
}