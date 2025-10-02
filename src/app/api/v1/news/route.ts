import { NextRequest, NextResponse } from 'next/server';
import type { NewsResponse } from '@/types/news';

// 예시 뉴스 큐레이션 데이터
const mockNewsData: NewsResponse = {
  curations: [
    {
      id: 'curation-1',
      title: 'KBO 야구 주요 뉴스 큐레이션',
      description: 'KBO 야구와 관련된 주요 뉴스들을 큐레이션하여 제공합니다.',
      curator: 'KBO 정보 큐레이터',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'general',
      articles: [
        {
          id: 'news-1',
          title: 'KIA 타이거즈, 5연승 달성하며 선두 수성',
          summary: 'KIA 타이거즈가 5연승을 달성하며 1위 자리를 굳건히 지키고 있다.',
          content: 'KIA 타이거즈는 4일 대구삼성라이온즈파크에서 열린 2025 KBO리그 삼성과의 경기에서 7-3으로 승리하며 5연승을 달성했다. 이로써 KIA는 50승30패1무를 기록하며 1위 자리를 유지하고 있다.',
          author: '야구전문기자',
          publishedAt: new Date(Date.now() - 86400000).toISOString(), // 하루 전
          imageUrl: '/kia-tigers.jpg',
          category: 'general',
          source: '스포츠 뉴스',
          url: '#'
        },
        {
          id: 'news-2',
          title: 'SSG 랜더스, 외국인 타자 영입 성공',
          summary: 'SSG 랜더스가 시즌 하반기를 위한 외국인 타자 영입에 성공했다.',
          content: 'SSG 랜더스는 3일 외국인 타자 A선수와 계약을 체결했다고 발표했다. A선수는 메이저리그 출신으로, 강력한 타격력을 자랑하는 선수다. SSG는 하반기 성적 반등을 위해 이번 영입을 결정했다.',
          author: '야구전문기자',
          publishedAt: new Date(Date.now() - 172800000).toISOString(), // 이틀 전
          imageUrl: '/ssg-landers.jpg',
          category: 'transfer',
          source: '스포츠 뉴스',
          url: '#'
        },
        {
          id: 'news-3',
          title: 'LG 트윈스, 홈런 기록 경신',
          summary: 'LG 트윈스가 이번 시즌 최다 홈런 기록을 경신했다.',
          content: 'LG 트윈스는 지난 경기에서 4개의 홈런을 추가하며 시즌 최다 홈런 기록을 갈아치웠다. 타선이 폭발적으로 터지며 승리를 챙겼다.',
          author: '야구전문기자',
          publishedAt: new Date(Date.now() - 259200000).toISOString(), // 사흛 전
          imageUrl: '/lg-twins.jpg',
          category: 'performance',
          source: '스포츠 뉴스',
          url: '#'
        }
      ]
    },
    {
      id: 'curation-2',
      title: '선수 이적 뉴스 큐레이션',
      description: 'KBO 리그 선수들의 이적 소식을 정리한 큐레이션입니다.',
      curator: '이적 전문 큐레이터',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'transfer',
      articles: [
        {
          id: 'news-4',
          title: 'NC 다이노스, 핵심 타자 FA 영입 성공',
          summary: 'NC 다이노스가 FA 시장에서 핵심 타자를 영입하며 전력 강화에 나섰다.',
          content: 'NC 다이노스는 FA 시장에서 A타자 영입에 성공했다. A타자는 5년 연속 20홈런 이상을 기록한 베테랑 타자로, NC 타선의 핵심이 될 전망이다.',
          author: '이적 전문기자',
          publishedAt: new Date(Date.now() - 345600000).toISOString(), // 넷쨋 전
          imageUrl: '/nc-dinos.jpg',
          category: 'transfer',
          source: '스포츠 이적 뉴스',
          url: '#'
        },
        {
          id: 'news-5',
          title: 'KT 위즈, 외국인 투수 재계약 발표',
          summary: 'KT 위즈가 주요 외국인 투수와 재계약을 발표했다.',
          content: 'KT 위즈는 에이스 외국인 투수 A선수와 2년 재계약을 체결했다. A선수는 지난 시즌 15승 4패 ERA 2.74의 훌륭한 성적을 거뒀다.',
          author: '이적 전문기자',
          publishedAt: new Date(Date.now() - 432000000).toISOString(), // 다섯쨋 전
          imageUrl: '/kt-wiz.jpg',
          category: 'transfer',
          source: '스포츠 이적 뉴스',
          url: '#'
        }
      ]
    },
    {
      id: 'curation-3',
      title: '팀 성적 분석 큐레이션',
      description: '각 KBO 팀들의 성적과 분석을 큐레이션하여 제공합니다.',
      curator: '데이터 분석 큐레이터',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'performance',
      articles: [
        {
          id: 'news-6',
          title: '두산 베어스, 타선 힘으로 연승 행진',
          summary: '두산 베어스가 타선의 좋은 활약으로 연승을 이어가고 있다.',
          content: '두산 베어스는 최근 6경기에서 5승 1패로 훌륭한 성적을 거두고 있다. 타선이 평균 6득점 이상을 기록하며 좋은 흐름을 이어가고 있다.',
          author: '데이터 분석기자',
          publishedAt: new Date(Date.now() - 518400000).toISOString(), // 여섯쨋 전
          imageUrl: '/doosan-bears.jpg',
          category: 'performance',
          source: '스포츠 데이터 뉴스',
          url: '#'
        }
      ]
    }
  ],
  articles: [
    {
      id: 'news-1',
      title: 'KIA 타이거즈, 5연승 달성하며 선두 수성',
      summary: 'KIA 타이거즈가 5연승을 달성하며 1위 자리를 굳건히 지키고 있다.',
      content: 'KIA 타이거즈는 4일 대구삼성라이온즈파크에서 열린 2025 KBO리그 삼성과의 경기에서 7-3으로 승리하며 5연승을 달성했다. 이로써 KIA는 50승30패1무를 기록하며 1위 자리를 유지하고 있다.',
      author: '야구전문기자',
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // 하루 전
      imageUrl: '/kia-tigers.jpg',
      category: 'general',
      source: '스포츠 뉴스',
      url: '#'
    },
    {
      id: 'news-2',
      title: 'SSG 랜더스, 외국인 타자 영입 성공',
      summary: 'SSG 랜더스가 시즌 하반기를 위한 외국인 타자 영입에 성공했다.',
      content: 'SSG 랜더스는 3일 외국인 타자 A선수와 계약을 체결했다고 발표했다. A선수는 메이저리그 출신으로, 강력한 타격력을 자랑하는 선수다. SSG는 하반기 성적 반등을 위해 이번 영입을 결정했다.',
      author: '야구전문기자',
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 이틀 전
      imageUrl: '/ssg-landers.jpg',
      category: 'transfer',
      source: '스포츠 뉴스',
      url: '#'
    }
  ],
  categories: ['general', 'transfer', 'performance']
};

// 뉴스 큐레이션 API 요청 처리
export async function GET(request: NextRequest) {
  try {
    // 실제 구현에서는 외부 API에서 데이터를 가져오거나 DB에서 조회합니다
    // 현재는 예시 데이터를 반환합니다
    return NextResponse.json(mockNewsData);
  } catch (error) {
    console.error('뉴스 큐레이션 정보를 가져오는데 실패했습니다:', error);
    return NextResponse.json(
      { error: '서버 오류로 인해 뉴스 큐레이션 정보를 가져올 수 없습니다.' },
      { status: 500 }
    );
  }
}