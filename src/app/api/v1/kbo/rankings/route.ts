import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';
import type { KboTeamRanking } from '@/types/kbo';

// 실제 KBO 데이터 소스에서 정보 가져오기 (웹 크롤링 방식)
// 타겟 테이블은 summary 속성으로 찾되, 테이블 헤더 정보는 실제 KBO 홈페이지의 thead th 정보를 동적으로 가져옴
async function getKboRankings(): Promise<{rankings: KboTeamRanking[], headers: string[]}> {
  try {
    // KBO 순위 페이지 URL
    const response = await fetch('https://www.koreabaseball.com/Record/TeamRank/TeamRank.aspx');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = load(html);
    
    // 테이블에서 순위 데이터 추출
    const rankings: KboTeamRanking[] = [];
    
    // KBO 공식 웹사이트의 실제 테이블 구조에 맞춰 수정
    // "순위"라는 요약 값을 가진 테이블을 찾아 그 안에서 행을 찾음
    const targetTable = $('table[summary*="순위"]');
    
    // thead 정보를 추출하여 컬럼 구조를 파악
    let headerRow: string[] = [];
    if (targetTable.length > 0) {
      // thead 정보를 추출
      const headerCells = targetTable.find('thead tr th');
      headerRow = [];
      headerCells.each((index, element) => {
        headerRow.push($(element).text().trim());
      });

      console.log('KBO 홈페이지 헤더 정보:', headerRow); // 디버깅용 로그

      // tbody에서 데이터 추출
      targetTable.find('tbody tr').each((index, element) => {
        const cells = $(element).find('td');
          
        // 팀명 셀이 있는지 확인하여 팀별 순위 행인지 판별
        // 원래 조건은 버튼이 있는지 확인했으나, 실제 페이지 구조 변경으로 수정
        if (cells.length >= headerRow.length && $(cells[1]).text().trim() !== '') {
          // 헤더 정보를 기반으로 동적 객체 생성
          const teamData: KboTeamRanking = { teamName: '' };
          
          // 각 셀의 데이터를 헤더 정보에 맞춰 동적으로 할당
          for (let i = 0; i < headerRow.length && i < cells.length; i++) {
            const header = headerRow[i];
            const cellText = $(cells[i]).text().trim();
            
            // 팀명이 있는 경우, teamName에 저장
            if (header.includes('팀') || header.includes('이름')) {
              // 팀명은 버튼 내부에 있을 수 있음
              const teamButton = $(cells[i]).find('button');
              if (teamButton.length > 0) {
                teamData.teamName = teamButton.text().trim();
              } else {
                teamData.teamName = cellText;
              }
            }
            
            // 모든 값을 문자열로 저장
            teamData[header] = cellText;
          }
          
          // 팀 데이터가 유효한 경우에만 rankings 배열에 추가
          if (teamData.teamName) {
            rankings.push(teamData);
          }
        }
      });
    } else {
      console.log('순위 테이블을 찾을 수 없습니다.');
    }
    
    // 크롤링된 데이터가 없을 경우 예시 데이터 반환
    if (rankings.length === 0) {
      console.log('크롤링된 데이터가 없습니다. 예시 데이터를 사용합니다.');
      return {
        rankings: [
          { '순위': '1', teamName: 'KIA 타이거즈', '승': '20', '패': '10', '무': '2', '승률': '0.667', '승차': '-', '최근10경기': 'oooxx', '연속': 'O2', '홈': '12-5-1', '원정': '8-5-1' },
          { '순위': '2', teamName: 'SSG 랜더스', '승': '19', '패': '11', '무': '2', '승률': '0.633', '승차': '1', '최근10경기': 'oxxoo', '연속': 'X1', '홈': '10-6-1', '원정': '9-5-1' },
          { '순위': '3', teamName: 'LG 트윈스', '승': '18', '패': '12', '무': '2', '승률': '0.600', '승차': '2', '최근10경기': 'oooxo', '연속': 'O1', '홈': '11-7-0', '원정': '7-5-2' },
          { '순위': '4', teamName: 'NC 다이노스', '승': '17', '패': '13', '무': '2', '승률': '0.567', '승차': '3', '최근10경기': 'xooox', '연속': 'X2', '홈': '10-8-0', '원정': '7-5-2' },
          { '순위': '5', teamName: 'KT 위즈', '승': '16', '패': '14', '무': '2', '승률': '0.533', '승차': '4', '최근10경기': 'oxoox', '연속': 'O3', '홈': '9-9-0', '원정': '7-5-2' },
          { '순위': '6', teamName: '두산 베어스', '승': '15', '패': '15', '무': '2', '승률': '0.500', '승차': '5', '최근10경기': 'xooxo', '연속': 'X1', '홈': '8-10-0', '원정': '7-5-2' },
          { '순위': '7', teamName: '롯데 자이언츠', '승': '14', '패': '16', '무': '2', '승률': '0.467', '승차': '6', '최근10경기': 'ooxxo', '연속': 'O1', '홈': '8-10-0', '원정': '6-6-2' },
          { '순위': '8', teamName: '삼성 라이온즈', '승': '13', '패': '17', '무': '2', '승률': '0.433', '승차': '7', '최근10경기': 'xoxxo', '연속': 'X2', '홈': '7-11-0', '원정': '6-6-2' },
          { '순위': '9', teamName: '한화 이글스', '승': '12', '패': '18', '무': '2', '승률': '0.400', '승차': '8', '최근10경기': 'oxoxo', '연속': 'O2', '홈': '7-11-0', '원정': '5-7-2' },
          { '순위': '10', teamName: '키움 히어로즈', '승': '11', '패': '19', '무': '2', '승률': '0.367', '승차': '9', '최근10경기': 'xoxoo', '연속': 'X3', '홈': '6-12-0', '원정': '5-7-2' },
        ],
        headers: ['순위', '팀', '승', '패', '무', '승률', '승차', '최근10경기', '연속', '홈', '원정']
      };
    }
    
    return { rankings, headers: headerRow };
  } catch (error) {
    console.error('KBO 순위 정보를 가져오는데 실패했습니다:', error);
    // 오류 발생 시 예시 데이터 반환
    return {
      rankings: [
        { '순위': '1', teamName: 'KIA 타이거즈', '승': '20', '패': '10', '무': '2', '승률': '0.667', '승차': '-', '최근10경기': 'oooxx', '연속': 'O2', '홈': '12-5-1', '원정': '8-5-1' },
        { '순위': '2', teamName: 'SSG 랜더스', '승': '19', '패': '11', '무': '2', '승률': '0.633', '승차': '1', '최근10경기': 'oxxoo', '연속': 'X1', '홈': '10-6-1', '원정': '9-5-1' },
        { '순위': '3', teamName: 'LG 트윈스', '승': '18', '패': '12', '무': '2', '승률': '0.600', '승차': '2', '최근10경기': 'oooxo', '연속': 'O1', '홈': '11-7-0', '원정': '7-5-2' },
        { '순위': '4', teamName: 'NC 다이노스', '승': '17', '패': '13', '무': '2', '승률': '0.567', '승차': '3', '최근10경기': 'xooox', '연속': 'X2', '홈': '10-8-0', '원정': '7-5-2' },
        { '순위': '5', teamName: 'KT 위즈', '승': '16', '패': '14', '무': '2', '승률': '0.533', '승차': '4', '최근10경기': 'oxoox', '연속': 'O3', '홈': '9-9-0', '원정': '7-5-2' },
        { '순위': '6', teamName: '두산 베어스', '승': '15', '패': '15', '무': '2', '승률': '0.500', '승차': '5', '최근10경기': 'xooxo', '연속': 'X1', '홈': '8-10-0', '원정': '7-5-2' },
        { '순위': '7', teamName: '롯데 자이언츠', '승': '14', '패': '16', '무': '2', '승률': '0.467', '승차': '6', '최근10경기': 'ooxxo', '연속': 'O1', '홈': '8-10-0', '원정': '6-6-2' },
        { '순위': '8', teamName: '삼성 라이온즈', '승': '13', '패': '17', '무': '2', '승률': '0.433', '승차': '7', '최근10경기': 'xoxxo', '연속': 'X2', '홈': '7-11-0', '원정': '6-6-2' },
        { '순위': '9', teamName: '한화 이글스', '승': '12', '패': '18', '무': '2', '승률': '0.400', '승차': '8', '최근10경기': 'oxoxo', '연속': 'O2', '홈': '7-11-0', '원정': '5-7-2' },
        { '순위': '10', teamName: '키움 히어로즈', '승': '11', '패': '19', '무': '2', '승률': '0.367', '승차': '9', '최근10경기': 'xoxoo', '연속': 'X3', '홈': '6-12-0', '원정': '5-7-2' },
      ],
      headers: ['순위', '팀', '승', '패', '무', '승률', '승차', '최근10경기', '연속', '홈', '원정']
    };
  }
}

// GET 요청 처리
export async function GET(request: NextRequest) {
  try {
    const result = await getKboRankings();
    return NextResponse.json(result);
  } catch (error) {
    console.error('KBO 순위 정보를 가져오는데 실패했습니다:', error);
    return NextResponse.json(
      { error: '서버 오류로 인해 순위 정보를 가져올 수 없습니다.' },
      { status: 500 }
    );
  }
}