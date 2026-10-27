---
title: Jekyll include 로 컴포넌트 만들기
categories: [dev]
---

반복되는 마크업은 `_includes/` 에 두고 파라미터를 넘겨 재사용합니다.

```liquid
{% raw %}{% include post-card.html post=post %}{% endraw %}
```

한 곳만 고치면 홈, 카테고리 페이지 등 모든 곳에 반영됩니다.
