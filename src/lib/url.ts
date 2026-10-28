const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** 외부 링크는 그대로, 내부 경로는 base 경로를 붙여 반환 */
export function withBase(path: string): string {
  if (/^(https?:)?\/\//.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${normalized}`;
}

export const categoryUrl = (category: string) => withBase(`/category/${slugify(category)}/`);

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '');
}
