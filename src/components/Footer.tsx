interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`bg-white border-t py-4 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} KBO Info - KBO 야구 정보 제공 앱</p>
      </div>
    </footer>
  );
}