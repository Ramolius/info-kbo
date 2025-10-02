// types/news.ts

// 뉴스 아티클 정보 인터페이스
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string; // ISO date string
  imageUrl?: string;
  category: string;
  source: string;
  url: string;
}

// 뉴스 큐레이션 정보 인터페이스
export interface NewsCuration {
  id: string;
  title: string;
  description: string;
  articles: NewsArticle[];
  curator: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  category: string;
}

// 뉴스 응답 정보 인터페이스
export interface NewsResponse {
  curations: NewsCuration[];
  articles: NewsArticle[];
  categories: string[];
}