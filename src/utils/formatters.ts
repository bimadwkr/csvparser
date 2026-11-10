/**
 * Format a number with thousand separators (e.g. 50,102)
 * If value is null or undefined (missing), returns empty string or optional placeholder.
 */
export function formatMetricNumber(
  val: number | null | undefined,
  placeholder: string = ''
): string {
  if (val === null || val === undefined) {
    return placeholder;
  }
  return new Intl.NumberFormat('en-US').format(val);
}

/**
 * Format file size in human readable format (Bytes, KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateISO(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
