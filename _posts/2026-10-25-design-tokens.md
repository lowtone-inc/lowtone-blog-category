---
title: 디자인 토큰으로 다크 모드 대응하기
categories: [design, dev]
---

색상을 CSS 변수로 정의해 두면, `prefers-color-scheme: dark` 에서 변수 값만 바꿔 다크 모드를 지원할 수 있습니다.

```scss
:root { --color-bg: #fff; }
@media (prefers-color-scheme: dark) {
  :root { --color-bg: #0f1115; }
}
```
