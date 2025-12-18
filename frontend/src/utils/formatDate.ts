/**
 * ISO 8601 날짜 문자열을 한국 형식으로 변환
 * @param isoString - ISO 8601 형식 날짜 문자열
 * @returns "YYYY-MM-DD HH:MM" 형식 문자열
 */
function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 시작일과 종료일을 범위 형식으로 변환
 * @param startDate - ISO 8601 시작 날짜
 * @param endDate - ISO 8601 종료 날짜
 * @returns "YYYY-MM-DD HH:MM ~ YYYY-MM-DD HH:MM" 형식 문자열
 */
function formatDateRange(startDate: string, endDate: string): string {
  const formattedStart = formatDateTime(startDate);
  const formattedEnd = formatDateTime(endDate);

  return `${formattedStart} ~ ${formattedEnd}`;
}

export { formatDateTime, formatDateRange };
