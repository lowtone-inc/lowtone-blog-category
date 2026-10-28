---
title: '폼 검증 로직을 한곳으로 모은 이야기'
category: dev
tags: []
description: '컴포넌트마다 흩어진 폼 검증을 규칙 객체 하나로 정리한 과정.'
pubDate: 2026-10-06T23:05:00+09:00
featured: false
draft: false
---

회원 정보 수정 화면을 고치다가 같은 검증이 세 군데에 복사돼 있는 걸 발견했다. 이메일 형식 검사가 가입 폼, 수정 폼, 초대 폼에 각각 조금씩 다른 모양으로 들어 있었다. 하나는 공백을 자르고, 하나는 안 자르고, 하나는 에러 문구가 오타였다. 이걸 정리한 기록이다.

## 시작 상태

대략 이런 코드였다. 컴포넌트 안에서 상태와 검증과 문구가 한꺼번에 섞여 있다.

```tsx
const [email, setEmail] = useState("");
const [emailError, setEmailError] = useState("");

const onSubmit = () => {
  if (!email.includes("@")) {
    setEmailError("이메일 형식이 아니에요");
    return;
  }
  // ...다른 필드도 같은 방식으로 반복
};
```

필드가 늘수록 `useState`가 두 배로 늘고, 제출 함수는 if문 더미가 된다. 무엇보다 규칙이 컴포넌트에 묶여 있으니 재사용도 테스트도 어렵다.

## 규칙을 데이터로 분리

먼저 "규칙"을 화면과 떼어냈다. 값을 받아서 에러 문구나 `null`을 돌려주는 순수 함수면 충분했다.

```ts
type Rule = (value: string) => string | null;

export const required: Rule = (v) =>
  v.trim() === "" ? "필수 입력이에요" : null;

export const email: Rule = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    ? null
    : "이메일 형식이 아니에요";

export const minLength = (n: number): Rule => (v) =>
  v.length >= n ? null : `${n}자 이상 입력해 주세요`;

export const validate = (value: string, rules: Rule[]) => {
  for (const rule of rules) {
    const message = rule(value);
    if (message) return message;
  }
  return null;
};
```

첫 번째로 걸린 에러만 돌려주는 이유는 화면에 에러가 한꺼번에 여러 줄 뜨는 게 오히려 부담스러웠기 때문이다. 이 파일에는 React가 전혀 없어서 단위 테스트가 쉽다. 이메일 규칙은 정상 값 두어 개, 공백 포함 값, `@`가 없는 값 정도만 넣고 바로 확인했다.

## 폼에서는 필드 설정만 선언

폼 쪽에서는 필드별로 어떤 규칙을 쓰는지만 적는다.

```ts
const fields = {
  name: [required],
  email: [required, email],
  password: [required, minLength(8)],
};
```

상태 관리는 `values`와 `touched`, 두 객체로 줄였다. 에러는 따로 저장하지 않고 렌더링할 때 `validate`로 계산한다. 에러 상태를 따로 들고 있으면 값과 에러가 어긋나는 버그가 생기기 쉬웠는데, 파생값으로 바꾸니 그 종류의 버그가 사라졌다.

## 언제 보여줄 것인가

규칙보다 더 고민한 건 에러를 언제 보여주느냐였다. 타이핑 도중에 바로 에러가 뜨면 아직 입력 중인데 혼내는 느낌이 든다. 그래서 이렇게 정했다.

- 필드를 벗어날 때(blur) 처음으로 에러를 보여준다.
- 한 번 에러가 보인 필드는 입력할 때마다 다시 검사해서 바로 풀어 준다.
- 제출 버튼을 누르면 모든 필드를 touched로 바꿔 한 번에 보여준다.

`touched[name] && validate(...)` 하나로 이 세 가지가 전부 해결된다.

## 남은 것

서버 검증은 여전히 따로다. 이메일 중복 같은 건 서버에 물어봐야 하니까 규칙 함수로 표현하지 못한다. 지금은 서버가 준 에러를 필드 에러보다 우선해서 보여주는 정도로 타협했다. 라이브러리를 쓸 수도 있었지만 필드가 열 개 이하인 폼 몇 개에는 이 정도 코드로 충분했다. 정리하고 나니 폼 컴포넌트가 훨씬 짧아졌고, 새 폼을 만들 때는 필드 설정만 쓰면 되는 점이 제일 만족스럽다.
