export const SITE = {
  title: 'LOWTONE Blog',
  tagline: '카테고리별로 정리하는 기술 블로그',
  description: '카테고리별로 정리하는 LOWTONE 기술 블로그',
  author: 'LOWTONE',
  locale: 'ko-KR',
  postsPerPage: 10,
  // 글별 이미지가 없을 때 쓰는 공유 이미지 (public/ 기준 경로)
  ogImage: '/og-default.png',
} as const;

// 서치콘솔 소유 확인 코드. 값이 있을 때만 meta 태그를 출력한다.
export const SITE_VERIFICATION = {
  google: '',
  naver: '0a572746545a76bff0b898531f1e9667c2e528c4',
} as const;

export const NAV_LINKS = [
  { href: '/', label: '홈' },
  { href: '/categories/', label: '카테고리' },
  { href: '/about/', label: '소개' },
] as const;
