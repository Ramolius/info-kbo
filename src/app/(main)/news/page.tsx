'use client';

import { useEffect, useState } from 'react';
import type { NewsResponse, NewsCuration, NewsArticle } from '@/types/news';

// 뉴스 큐레이션 페이지 컴포넌트
export default function NewsPage() {
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 뉴스 데이터 가져오기
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/v1/news');
        if (!response.ok) {
          throw new Error('뉴스 정보를 불러오는데 실패했습니다.');
        }
        const data: NewsResponse = await response.json();
        
        // 데이터를 상태에 저장
        setNewsData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // 로딩 중 상태 표시
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">뉴스 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생 시 상태 표시
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">에러 발생</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 카테고리별 필터링된 큐레이션 데이터
  const filteredCurations = selectedCategory === 'all' 
    ? newsData?.curations || []
    : newsData?.curations.filter(curation => curation.category === selectedCategory) || [];

  // 고유 카테고리 목록
  const categories = ['all', ...Array.from(new Set(newsData?.curations.map(c => c.category) || []))];

  return (
    <div className="w-full">
      {/* 현재 섹션 헤더 */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">KBO 뉴스 큐레이션</h2>
        <p className="text-gray-600">KBO 야구 관련 최신 뉴스를 큐레이션하여 제공합니다</p>
        <div className="mt-2 text-gray-500 text-sm">
          <p>업데이트 시간: {new Date().toLocaleString('ko-KR')}</p>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? '전체' : category}
          </button>
        ))}
      </div>

      {/* 큐레이션 목록 */}
      <div className="space-y-12">
          {filteredCurations.length > 0 ? (
            filteredCurations.map((curation) => (
              <section key={curation.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{curation.title}</h3>
                      <p className="text-gray-600 mb-2">{curation.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>큐레이터: {curation.curator}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(curation.updatedAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {curation.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 아티클 목록 */}
                <div className="p-6">
                  <div className="space-y-6">
                    {curation.articles.map((article) => (
                      <article key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex flex-col md:flex-row gap-4">
                          {article.imageUrl && (
                            <div className="md:w-1/4">
                              <img 
                                src={article.imageUrl} 
                                alt={article.title} 
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div className={article.imageUrl ? 'md:w-3/4' : 'w-full'}>
                            <h4 className="text-lg font-bold text-gray-800 mb-2">{article.title}</h4>
                            <p className="text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                              <span>출처: {article.source}</span>
                              <span>작성자: {article.author}</span>
                              <span>{new Date(article.publishedAt).toLocaleDateString('ko-KR')}</span>
                              <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 font-medium"
                              >
                                원문 보기
                              </a>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">선택한 카테고리에 해당하는 뉴스 큐레이션이 없습니다.</p>
            </div>
          )}
        </div>
    </div>
  );
}