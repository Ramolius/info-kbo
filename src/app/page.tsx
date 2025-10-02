'use client';

import { useEffect, useState } from 'react';
import type { KboTeamRanking } from '@/types/kbo';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import OffCanvasMenu from './components/OffCanvasMenu';

// KBO 순위 API 응답을 위한 인터페이스 정의
interface KboRankingsResponse {
  rankings: KboTeamRanking[];
  headers: string[]; // KBO 홈페이지의 실제 헤더 정보
}

// 팀 로고 정보 타입 정의
interface TeamLogo {
  name: string;
  color: string;
}

// 팀 로고 정보
const TEAM_LOGOS: TeamLogo[] = [
  { name: 'KIA', color: '#FF6B00' },
  { name: 'SSG', color: '#002D62' },
  { name: 'LG', color: '#00599F' },
  { name: 'NC', color: '#F15F22' },
  { name: 'KT', color: '#000000' },
  { name: '롯데', color: '#D63420' },
  { name: '삼성', color: '#0038A8' },
  { name: '한화', color: '#F9D000' },
  { name: '두산', color: '#005CA9' },
  { name: '키움', color: '#4D8FCC' },
];

// 팀명에 따라 로고 색상 가져오기
const getTeamLogoColor = (teamName: string): string => {
  const team = TEAM_LOGOS.find(team => team.name === teamName) || TEAM_LOGOS[0];
  return team.color;
};

// 뷰 모드 타입
type ViewMode = 'card' | 'table';

// Home 컴포넌트: KBO 순위 정보를 표시하는 메인 페이지
export default function Home() {
  // 상태 관리를 위한 state 변수들
  const [rankings, setRankings] = useState<KboTeamRanking[]>([]); // 순위 정보
  const [headers, setHeaders] = useState<string[]>([]);          // 헤더 정보
  const [loading, setLoading] = useState(true);                   // 로딩 상태
  const [error, setError] = useState<string | null>(null);        // 에러 상태
  const [viewMode, setViewMode] = useState<ViewMode>('card');     // 뷰 모드 (카드/테이블)

  // 모바일 메뉴 상태
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Swiper 모듈 설정
  const swiperModules = [Navigation, Pagination];

  // 컴포넌트 마운트 시 순위 정보 가져오기
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        // API 엔드포인트에서 KBO 순위 정보를 가져옴
        const response = await fetch('/api/v1/kbo/rankings');
        if (!response.ok) {
          throw new Error('순위 정보를 불러오는데 실패했습니다.');
        }
        const data: KboRankingsResponse = await response.json();
        setRankings(data.rankings);
        setHeaders(data.headers);
        setLoading(false);
      } catch (err) {
        // 에러 발생 시 상태 업데이트
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // 로딩 중 상태 표시
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">순위 정보를 불러오는 중...</p>
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

  // 팀 이름 및 순위 컬럼 찾기
  const teamNameHeader = headers.find(header => header.includes('팀') || header.includes('이름'));
  const rankHeader = headers.find(header => header.includes('순위') || header.includes('순') || header.includes('RANK'));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 헤더 섹션 */}
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
              <a href="#" className="text-blue-600 font-medium">순위</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">경기일정</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">선수정보</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">뉴스</a>
            </nav>
            
            {/* 뷰 모드 토글 */}
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600 hidden sm:inline">카드</span>
              <button 
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${viewMode === 'card' ? 'bg-blue-500' : 'bg-gray-300'}`}
                onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${viewMode === 'card' ? 'translate-x-1' : 'translate-x-6'}`} />
              </button>
              <span className="ml-2 text-sm text-gray-600 hidden sm:inline">표</span>
            </div>
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
            <a href="#" className="block py-3 text-lg text-blue-600 font-medium border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>순위</a>
            <a href="#" className="block py-3 text-lg text-gray-600 hover:text-blue-600 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>경기일정</a>
            <a href="#" className="block py-3 text-lg text-gray-600 hover:text-blue-600 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>선수정보</a>
            <a href="#" className="block py-3 text-lg text-gray-600 hover:text-blue-600 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>뉴스</a>
          </nav>
        </div>
      </OffCanvasMenu>
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6">
        {/* 현재 섹션 헤더 */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">KBO 순위표</h2>
          <p className="text-gray-600">실시간 KBO 야구 순위 정보</p>
          <div className="mt-2 text-gray-500 text-sm">
            <p>업데이트 시간: {new Date().toLocaleString('ko-KR')}</p>
          </div>
        </div>

        {/* 뷰 모드에 따른 컨텐츠 표시 */}
        {viewMode === 'card' ? (
          <div className="mb-6">
            {/* 모바일과 데스크톱 모두 Swiper 카드 뷰로 통일 */}
            <Swiper
              modules={swiperModules}
              spaceBetween={12}
              slidesPerView={1.1}
              centeredSlides={true}
              pagination={{ clickable: true }}
              className="py-2"
              breakpoints={{
                // 데스크톱에서는 3개의 카드를 볼 수 있도록 설정
                1024: {
                  slidesPerView: 2.3,
                  centeredSlides: false,
                  spaceBetween: 20
                },
                // 랩탑에서는 2개의 카드를 볼 수 있도록 설정
                768: {
                  slidesPerView: 1.5,
                  centeredSlides: false,
                  spaceBetween: 16
                }
              }}
            >
              {rankings.map((team, index) => {
                const teamName = team[teamNameHeader || ''] || team.teamName;
                const rank = team[rankHeader || ''];
                const logoColor = getTeamLogoColor(teamName);
                
                // 모바일에서 표시할 모든 데이터 추출
                const additionalData = headers
                  .filter(header => 
                    header !== teamNameHeader && 
                    header !== rankHeader &&
                    !header.includes('승') && 
                    !header.includes('패') && 
                    !header.includes('무') && 
                    !header.includes('승률') && 
                    !header.includes('게임차') && 
                    !header.includes('Behind')
                  )
                  .map(header => ({
                    label: header,
                    value: team[header]
                  }));
                
                // 주요 데이터 추출
                const wins = headers.find(h => h.includes('승') && !h.includes('승률')) ? team[headers.find(h => h.includes('승') && !h.includes('승률')) || ''] : '';
                const losses = headers.find(h => h.includes('패')) ? team[headers.find(h => h.includes('패')) || ''] : '';
                const draws = headers.find(h => h.includes('무')) ? team[headers.find(h => h.includes('무')) || ''] : '';
                const winRate = headers.find(h => h.includes('승률')) ? team[headers.find(h => h.includes('승률')) || ''] : '';
                const gamesBehindHeader = headers.find(h => h.includes('게임차') || h.includes('Behind')) || '';
                const gamesBehind = gamesBehindHeader ? team[gamesBehindHeader] : '';
                
                return (
                  <SwiperSlide key={`${teamName}-${index}`}>
                    <div 
                      className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
                    >
                      <div 
                        className="h-3" 
                        style={{ backgroundColor: logoColor }}
                      ></div>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div 
                              className="w-5 h-5 rounded-full mr-3" 
                              style={{ backgroundColor: logoColor }}
                            ></div>
                            <h3 className="font-bold text-xl text-gray-800">{teamName}</h3>
                          </div>
                          <div className="flex items-center">
                            <span className="text-3xl font-bold text-gray-700 mr-1">{rank}</span>
                            <span className="text-gray-500 font-medium">위</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-blue-600 font-semibold">승</div>
                            <div className="text-lg font-bold text-gray-800 mt-1">{wins}</div>
                          </div>
                          <div className="bg-red-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-red-600 font-semibold">패</div>
                            <div className="text-lg font-bold text-gray-800 mt-1">{losses}</div>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-600 font-semibold">무</div>
                            <div className="text-lg font-bold text-gray-800 mt-1">{draws}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600 font-medium">승률</span>
                            <span className="text-xl font-bold text-gray-800">{winRate}</span>
                          </div>
                          {gamesBehind && (
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-gray-600 font-medium">게임차</span>
                              <span className="text-xl font-bold text-gray-800">{gamesBehind}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-auto pt-3 border-t border-gray-100 space-y-2">
                          {additionalData.map((data, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-gray-600 text-sm">{data.label}</span>
                              <span className="font-medium text-gray-800 text-sm">{data.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <tr>
                  {/* 동적으로 가져온 KBO 홈페이지의 실제 헤더 정보를 표시 */}
                  {headers.map((header, index) => (
                    <th 
                      key={index} 
                      className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* 각 팀의 순위 정보를 반복하여 표시 */}
                {rankings.map((team) => {
                  const teamName = team[teamNameHeader || ''] || team.teamName;
                  const logoColor = getTeamLogoColor(teamName);
                  
                  return (
                    <tr 
                      key={team.teamName} 
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      {headers.map((header, index) => {
                        if (header === teamNameHeader) {
                          return (
                            <td 
                              key={index} 
                              className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900 flex items-center"
                            >
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: logoColor }}
                              ></div>
                              {team[header]}
                            </td>
                          );
                        }
                        
                        return (
                          <td 
                            key={index} 
                            className="px-4 py-4 whitespace-nowrap text-sm text-gray-700"
                          >
                            {team[header]}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>※ 실제 데이터와 다를 수 있습니다. 정확한 정보는 KBO 공식 홈페이지를 참고하세요.</p>
          <p className="mt-2">Designed for KBO fans with ❤️</p>
        </div>
      </main>
      
      {/* 푸터 섹션 */}
      <footer className="bg-white border-t py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} KBO Info - KBO 야구 정보 제공 앱</p>
        </div>
      </footer>
    </div>
  );
}