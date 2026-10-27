# LOWTONE Blog (Jekyll)

카테고리 중심의 GitHub Pages 블로그입니다.

## 로컬 실행

```bash
bundle install
bundle exec jekyll serve --livereload
# http://localhost:4000/lowtone-blog-category/
```

## 글 쓰기

`_posts/YYYY-MM-DD-slug.md` 파일을 만들고 front matter 를 작성합니다.

```yaml
---
title: 글 제목
categories: [dev]          # _data/categories.yml 의 key
description: 목록 요약 (선택)
---
```

- 카테고리 페이지(`/category/<slug>/`)는 `jekyll-archives` 가 자동 생성합니다.
- 새 카테고리의 표시 이름·설명은 `_data/categories.yml` 에 추가합니다. (없어도 slug 로 동작)
- 상단 메뉴는 `_data/navigation.yml` 에서 관리합니다.

## 구조

| 경로 | 역할 |
| --- | --- |
| `_layouts/` | `default` → `home` / `post` / `page` / `category` |
| `_includes/` | 재사용 컴포넌트 (`post-list` → `post-card` → `post-meta` → `category-list` → `category-link`) |
| `_sass/` | `tokens`(색·크기 변수) · `mixins`(반복 스타일) · `base` · `layout` · `components` |
| `_data/` | 카테고리 메타데이터, 내비게이션 |

카테고리 slug → 이름/URL 변환은 `_includes/category-link.html` 한 곳에서만 처리합니다.

## 배포

`main` 브랜치에 push 하면 `.github/workflows/pages.yml` 이 빌드·배포합니다.
최초 1회 **Settings → Pages → Source** 를 **GitHub Actions** 로 설정하세요.
