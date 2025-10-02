# Qwen Code 작업 지침

## 공통 설정
- 한국어를 주언어로 사용합니다.
- git repository = https://github.com/Ramolius/info-kbo.git

## 코딩 스타일
- 변수명은 camelCase를 사용합니다.
- 함수는 명확하고 구체적인 이름을 사용해야 합니다.
- 주석을 적극적으로 적어야 합니다.

## 프로젝트 아키텍처
- Next.js 프레임워크를 사용합니다.
- 디렉토리 구조는 MVC 관례를 따른다.

## 특정 기능 관련 지침
- 모든 API 엔드포인트는 `/api/v1`로 시작해야 합니다.

## "순위" 메뉴 페이지의 설정
- https://www.koreabaseball.com/Record/TeamRank/TeamRank.aspx 페이지에서 "순위" 글자가 summary에 포함된 테이블 하나를 타겟테이블로 참조하도록 한다.
- 타겟테이블의 thead 정보 크롤링 대상으로 설정한다.

## "뉴스" 메뉴 페이지의 설정
- https://www.koreabaseball.com/medianews/news/breakingnews/list.aspx 참조하도록 한다.

## 작업 이력 관리
- 한국어로 작성한다.
- todo_write으로 생성한 작업 이력은 별도의 파일인 TODO_HISTORY.md에 yyyy-MM-dd 형식으로 저장합니다.
- TODO_HISTORY.md 파일은 프로젝트 루트에 위치시킵니다.
- 작업 이력 파일은 다음과 같은 형식으로 작성합니다:
  - yyyy-MM-dd
    - 작업 내용 1
    - 작업 내용 2
  - yyyy-MM-dd
    - 작업 내용 1