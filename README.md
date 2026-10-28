# nexuvo.fyi

Astro 기반 정적 블로그 (LOWTONE Blog). `main` 브랜치에 merge/push하면 GitHub Actions로 GitHub Pages에 자동 배포됩니다.

## 개발

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 타입 체크 + 빌드 -> dist/
```

## 글 작성

`src/content/posts/<slug>.md` 에 파일 추가. 글 URL은 `/YYYY/MM/DD/<slug>/` (날짜는 KST 기준).

```md
---
title: '제목'
description: '요약'
pubDate: 2026-10-27T09:00:00+09:00
category: dev
tags: []
featured: false
draft: false
---
```

- `category` 의 표시 이름/설명은 `src/data/categories.ts` 에서 관리합니다. (없어도 key가 그대로 표시됨)
- 카테고리 페이지(`/category/<slug>/`)는 글이 있는 카테고리마다 자동 생성됩니다.

## 구조

```
src/
├─ config.ts            사이트 설정, 네비게이션, 서치콘솔 인증 코드
├─ content.config.ts    글 front matter 스키마
├─ data/categories.ts   카테고리 표시 이름/설명
├─ lib/                 글 조회, URL, 날짜 유틸
├─ components/          Header, PostCard, BaseHead(SEO) 등
├─ layouts/             BaseLayout, PostLayout
├─ pages/               홈, 글, 카테고리, feed.xml, sitemap.xml, robots.txt
└─ styles/              tokens / base / components (plain CSS)
```

## 배포

1. 저장소 **Settings -> Pages -> Source** 를 `GitHub Actions` 로 설정
2. `main` 에 merge (또는 Actions 탭에서 수동 실행)

커스텀 도메인은 `public/CNAME` 에 있습니다.
