// 카테고리 표시 이름/설명. key는 글 front matter의 `category` 값.
// 여기 없는 카테고리도 동작하며, 그 경우 key가 그대로 표시된다.
// 객체 순서가 /categories/ 목록의 노출 순서다.
export interface CategoryMeta {
  name: string;
  description: string;
}

export const CATEGORIES: Record<string, CategoryMeta> = {
  dev: { name: '개발', description: '개발 과정에서 배운 것들을 기록합니다.' },
  design: { name: '디자인', description: '디자인 패턴과 UI/UX 이야기.' },
  daily: { name: '일상', description: '팀과 일하는 방식, 소소한 이야기.' },
};
