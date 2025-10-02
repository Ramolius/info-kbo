// types/kbo.ts

// KBO 팀 순위 정보 인터페이스 - 동적 필드를 위한 인덱스 시그니처 포함
export interface KboTeamRanking {
  // 고정 필드
  teamName: string;
  
  // 동적 필드를 위한 인덱스 시그니처 - 모든 값은 문자열로 처리
  [key: string]: string;
}

// KBO 테이블 헤더 정보
export interface KboTableHeader {
  headers: string[];
}

// KBO 순위 응답 정보
export interface KboRankingsResponse {
  rankings: KboTeamRanking[];
  headers: string[];
}