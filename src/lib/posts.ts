import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES } from '@/data/categories';
import { SITE } from '@/config';
import { kstParts } from './format';
import { slugify, withBase } from './url';

export type Post = CollectionEntry<'posts'>;

const byNewest = (a: Post, b: Post) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/** 공개된 글을 최신순으로 반환 (draft는 dev 모드에서만 노출) */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort(byNewest);
}

/** 글 경로 파츠: /YYYY/MM/DD/slug/ (날짜는 KST 기준) */
export function postParams(post: Post) {
  return { ...kstParts(post.data.pubDate), slug: post.id };
}

export function postUrl(post: Post): string {
  const { year, month, day, slug } = postParams(post);
  return withBase(`/${year}/${month}/${day}/${slug}/`);
}

export interface CategoryGroup {
  key: string;
  slug: string;
  name: string;
  description?: string;
  posts: Post[];
}

/** 카테고리별로 글을 묶어 반환. data/categories.ts 순서 우선, 나머지는 이름순 */
export async function getCategoryGroups(): Promise<CategoryGroup[]> {
  const groups = new Map<string, CategoryGroup>();
  for (const post of await getPosts()) {
    const key = post.data.category;
    const meta = CATEGORIES[key];
    const group = groups.get(key) ?? {
      key,
      slug: slugify(key),
      name: meta?.name ?? key,
      description: meta?.description,
      posts: [],
    };
    group.posts.push(post);
    groups.set(key, group);
  }
  const order = Object.keys(CATEGORIES);
  const rank = (key: string) => (order.includes(key) ? order.indexOf(key) : order.length);
  return [...groups.values()].sort((a, b) => rank(a.key) - rank(b.key) || a.key.localeCompare(b.key));
}

/** 이전(older)/다음(newer) 글 계산 (posts는 최신순) */
export function getAdjacent(posts: Post[], id: string) {
  const index = posts.findIndex((p) => p.id === id);
  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export interface PageSlice {
  items: Post[];
  page: number;
  totalPages: number;
  prevUrl?: string;
  nextUrl?: string;
}

export const totalPagesOf = (count: number) => Math.max(1, Math.ceil(count / SITE.postsPerPage));
export const pageUrl = (page: number) => withBase(page <= 1 ? '/' : `/page/${page}/`);

/** 홈 페이지네이션 (1페이지는 /, 이후는 /page/N/) */
export function paginatePosts(posts: Post[], page: number): PageSlice {
  const totalPages = totalPagesOf(posts.length);
  const start = (page - 1) * SITE.postsPerPage;
  return {
    items: posts.slice(start, start + SITE.postsPerPage),
    page,
    totalPages,
    prevUrl: page > 1 ? pageUrl(page - 1) : undefined,
    nextUrl: page < totalPages ? pageUrl(page + 1) : undefined,
  };
}
