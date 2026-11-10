import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { FollowerRecord } from '../types/follower';
import { formatDateISO } from './formatters';

export const FOLLOWER_EXPORT_COLUMNS = [
  'Username Instagram',
  'Full Name',
  'Followers',
  'Following',
  'Profile URL',
  'Status',
  'Error Description'
] as const;

function formatRecordsForExport(records: FollowerRecord[]) {
  return records.map((record) => ({
    'Username Instagram': record.username,
    'Full Name': record.userFullName || '',
    'Followers': record.followersCount !== null ? record.followersCount : '',
    'Following': record.followsCount !== null ? record.followsCount : '',
    'Profile URL': record.profileUrl || '',
    'Status': record.status === 'found' ? 'Active' : 'Not Found',
    'Error Description': record.errorDescription || ''
  }));
}

/**
 * Generate CSV for Follower data with UTF-8 BOM
 */
export function generateFollowerCSV(records: FollowerRecord[]): string {
  const rows = formatRecordsForExport(records);

  const csvBody = Papa.unparse(rows, {
    columns: [...FOLLOWER_EXPORT_COLUMNS],
    quotes: false,
    header: true,
    newline: '\r\n'
  });

  return '\uFEFF' + csvBody;
}

/**
 * Download CSV for Follower data
 */
export function downloadFollowerCSV(records: FollowerRecord[], customFilename?: string): void {
  const csvContent = generateFollowerCSV(records);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const dateStr = formatDateISO();
  const filename = customFilename || `instagram_followers_clean_${dateStr}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download Excel (.xlsx) for Follower data
 */
export function downloadFollowerExcel(records: FollowerRecord[], customFilename?: string): void {
  const data = formatRecordsForExport(records);

  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: [...FOLLOWER_EXPORT_COLUMNS]
  });

  // Set column widths
  worksheet['!cols'] = [
    { wch: 22 }, // Username Instagram
    { wch: 28 }, // Full Name
    { wch: 14 }, // Followers
    { wch: 14 }, // Following
    { wch: 45 }, // Profile URL
    { wch: 12 }, // Status
    { wch: 26 }  // Error Description
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Follower Data');

  const dateStr = formatDateISO();
  const filename = customFilename || `instagram_followers_clean_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
}
