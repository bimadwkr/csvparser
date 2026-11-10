import * as XLSX from 'xlsx';
import { InstagramRecord } from '../types/instagram';
import { formatDateISO } from './formatters';

export const EXCEL_OUTPUT_COLUMNS = [
  'Username Instagram',
  'Link Video Instagram',
  'View',
  'Like',
  'Comment',
  'Share',
  'Bookmarks'
] as const;

/**
 * Trigger download of the cleaned data as a native Microsoft Excel (.xlsx) file
 */
export function downloadExcelFile(records: InstagramRecord[], customFilename?: string): void {
  const data = records.map((record) => ({
    'Username Instagram': record.username,
    'Link Video Instagram': record.videoLink || '',
    'View': record.view !== null ? record.view : '',
    'Like': record.like !== null ? record.like : '',
    'Comment': record.comment !== null ? record.comment : '',
    'Share': record.share !== null ? record.share : '',
    'Bookmarks': record.bookmarks !== null ? record.bookmarks : ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: [...EXCEL_OUTPUT_COLUMNS]
  });

  // Set nice column widths for Excel
  worksheet['!cols'] = [
    { wch: 24 }, // Username Instagram
    { wch: 45 }, // Link Video Instagram
    { wch: 14 }, // View
    { wch: 14 }, // Like
    { wch: 14 }, // Comment
    { wch: 14 }, // Share
    { wch: 14 }  // Bookmarks
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cleaned Metrics');

  const dateStr = formatDateISO();
  const filename = customFilename || `instagram_metrics_clean_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
}
