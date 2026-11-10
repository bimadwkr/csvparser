import Papa from 'papaparse';
import { ColumnMapping, InstagramRecord, MetricSummary, ParseResult } from '../types/instagram';
import { detectColumnMapping } from './columnMapper';

/**
 * Safely parse a numeric metric value.
 * Preserves 0 as 0. Returns null for empty, missing, or invalid values.
 */
export function parseMetricValue(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  const str = String(value).trim();
  if (str === '') {
    return null;
  }

  // Remove commas or thousand separators if present in raw string
  const cleaned = str.replace(/,/g, '');
  const num = Number(cleaned);

  if (isNaN(num)) {
    return null;
  }

  return num;
}

/**
 * Safely format an Instagram video or post URL
 */
export function formatVideoLink(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = String(value).trim();
  if (!s) return '';

  // Already a full URL
  if (s.startsWith('http://') || s.startsWith('https://')) {
    return s;
  }

  // If it's an Instagram shortcode (e.g. DfKmPuASMEU)
  if (/^[A-Za-z0-9_-]{5,20}$/.test(s)) {
    return `https://www.instagram.com/reel/${s}/`;
  }

  return s;
}

/**
 * Build records array from parsed rows and active column mapping
 */
export function buildRecordsFromRows(
  rows: Record<string, string>[],
  mapping: ColumnMapping
): InstagramRecord[] {
  return rows.map((row, index) => {
    const usernameRaw = mapping.username ? row[mapping.username] : '';
    const username = usernameRaw !== undefined && usernameRaw !== null ? String(usernameRaw) : '';

    const videoLinkRaw = mapping.videoLink ? row[mapping.videoLink] : '';
    const videoLink = formatVideoLink(videoLinkRaw);

    const viewRaw = mapping.view ? row[mapping.view] : undefined;
    const likeRaw = mapping.like ? row[mapping.like] : undefined;
    const commentRaw = mapping.comment ? row[mapping.comment] : undefined;
    const shareRaw = mapping.share ? row[mapping.share] : undefined;
    const bookmarksRaw = mapping.bookmarks ? row[mapping.bookmarks] : undefined;

    return {
      id: `row-${index + 1}`,
      username,
      videoLink,
      view: parseMetricValue(viewRaw),
      like: parseMetricValue(likeRaw),
      comment: parseMetricValue(commentRaw),
      share: parseMetricValue(shareRaw),
      bookmarks: parseMetricValue(bookmarksRaw),
      raw: row
    };
  });
}

/**
 * Calculate summary cards statistics
 */
export function calculateSummary(records: InstagramRecord[]): MetricSummary {
  const summary: MetricSummary = {
    totalPosts: records.length,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    totalBookmarks: 0,
    viewAvailableCount: 0,
    likeAvailableCount: 0,
    commentAvailableCount: 0,
    shareAvailableCount: 0,
    bookmarkAvailableCount: 0,
    videoLinkCount: 0
  };

  for (const record of records) {
    if (record.videoLink) {
      summary.videoLinkCount++;
    }
    if (record.view !== null) {
      summary.totalViews += record.view;
      summary.viewAvailableCount++;
    }
    if (record.like !== null) {
      summary.totalLikes += record.like;
      summary.likeAvailableCount++;
    }
    if (record.comment !== null) {
      summary.totalComments += record.comment;
      summary.commentAvailableCount++;
    }
    if (record.share !== null) {
      summary.totalShares += record.share;
      summary.shareAvailableCount++;
    }
    if (record.bookmarks !== null) {
      summary.totalBookmarks += record.bookmarks;
      summary.bookmarkAvailableCount++;
    }
  }

  return summary;
}

/**
 * Parse CSV file into standardized Instagram data structure
 */
export function parseInstagramCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          if (!results.data || results.data.length === 0) {
            reject(new Error(results.errors[0].message || 'Failed to parse CSV file.'));
            return;
          }
        }

        const headers = results.meta.fields || [];
        if (headers.length === 0) {
          reject(new Error('The uploaded CSV file contains no headers.'));
          return;
        }

        const { mapping, warnings } = detectColumnMapping(headers);
        const records = buildRecordsFromRows(results.data, mapping);

        resolve({
          fileName: file.name,
          fileSize: file.size,
          headers,
          records,
          mapping,
          detectedWarnings: warnings,
          totalRawRows: results.data.length
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}
