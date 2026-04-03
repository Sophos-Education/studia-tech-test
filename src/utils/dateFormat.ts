/**
 * Example: "Mon, Jan 15, 10:00"
 */
export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Example: "10:00"
 */
export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Example: "10:00 - 11:00"
 */
export function formatTimeRange(
  startDate: Date | string,
  endDate: Date | string,
): string {
  return `${formatTime(startDate)} - ${formatTime(endDate)}`;
}

/**
 * Example: "Mon, Jan 15, 10:00 - 11:00"
 */
export function formatSessionDateTime(
  startDate: Date | string,
  endDate: Date | string,
): string {
  const dateStr = new Date(startDate).toLocaleString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const timeRange = formatTimeRange(startDate, endDate);
  return `${dateStr}, ${timeRange}`;
}
