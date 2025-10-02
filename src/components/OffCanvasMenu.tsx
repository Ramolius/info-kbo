'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface OffCanvasMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function OffCanvasMenu({ isOpen, onClose, children }: OffCanvasMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 렌더링되도록 설정
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    if (!isOpen || !isMounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    // ESC 키로 닫기
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    // body 스크롤 방지
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isMounted]);

  // 서버 사이드에서는 렌더링하지 않음
  if (!isMounted) {
    return null;
  }

  // 모달 렌더링을 body에 하기 위한 포탈 사용
  const menuContent = (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 h-full w-4/5 max-w-sm z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white shadow-lg`}
    >
      <div className="h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );

  return createPortal(menuContent, document.body);
}