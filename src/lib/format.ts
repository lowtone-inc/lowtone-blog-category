// 날짜 표기·URL은 모두 한국 시간(Asia/Seoul) 기준
const TIME_ZONE = 'Asia/Seoul';

const partsFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** KST 기준 연/월/일 (모두 0 패딩 문자열) */
export function kstParts(date: Date) {
  const parts = Object.fromEntries(partsFormatter.formatToParts(date).map((p) => [p.type, p.value]));
  return { year: parts.year, month: parts.month, day: parts.day };
}

/** 화면 표기용 YYYY.MM.DD */
export function formatDate(date: Date): string {
  const { year, month, day } = kstParts(date);
  return `${year}.${month}.${day}`;
}

export const isoDate = (date: Date) => date.toISOString();

const CJK = /[぀-ヿ㐀-鿿가-힯]/g;
const CHARS_PER_MINUTE = 250;

/** 한글 등 CJK는 글자 수, 나머지는 단어 수로 세어 읽는 시간(분)을 반환 */
export function readingMinutes(text = ''): number {
  const plain = text.replace(/<[^>]*>/g, ' ');
  const cjkCount = plain.match(CJK)?.length ?? 0;
  const wordCount = plain.replace(CJK, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.floor((cjkCount + wordCount) / CHARS_PER_MINUTE));
}

