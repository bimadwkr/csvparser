import { InstagramRecord } from '../types/instagram';

export type ReorderMode = 'link' | 'username';

/**
 * Clean and parse custom items (links or usernames) from user text input
 */
export function parseCustomInputList(rawText: string): string[] {
  if (!rawText.trim()) return [];

  const rawItems = rawText.split(/[\r\n,]+/);
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of rawItems) {
    const cleaned = item.trim();
    if (cleaned.length > 0) {
      const lower = cleaned.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        result.push(cleaned);
      }
    }
  }

  return result;
}

/**
 * Extract a robust Instagram post identifier from a URL or shortcode:
 * Handles:
 * - https://www.instagram.com/reel/DfKmPuASMEU/?igsh=123
 * - https://www.instagram.com/p/DfKmPuASMEU/
 * - instagram.com/reel/DfKmPuASMEU
 * - DfKmPuASMEU (standalone shortcode)
 * - Raw CDN URL (fallback)
 */
export function extractInstagramIdentifier(val: string): string {
  if (!val) return '';
  const s = String(val).trim();

  // Match /reel/CODE, /p/CODE, /tv/CODE
  const igMatch = s.match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/i);
  if (igMatch) {
    return igMatch[1];
  }

  // Standalone shortcode (typically 8-15 characters)
  if (/^[A-Za-z0-9_-]{5,25}$/.test(s)) {
    return s;
  }

  // Fallback: clean URL without query parameters, protocol, www, trailing slashes
  return s
    .split('?')[0]
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

/**
 * Extract unique Instagram video links from existing parsed records
 */
export function getUniqueLinksFromRecords(records: InstagramRecord[]): string[] {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const r of records) {
    const link = r.videoLink.trim();
    if (link) {
      const id = extractInstagramIdentifier(link);
      if (id && !seen.has(id.toLowerCase())) {
        seen.add(id.toLowerCase());
        list.push(link);
      }
    }
  }
  return list;
}

/**
 * Extract unique usernames from existing parsed records
 */
export function getUniqueUsernamesFromRecords(records: InstagramRecord[]): string[] {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const r of records) {
    const cleaned = r.username.trim().replace(/^@+/, '');
    if (cleaned && !seen.has(cleaned.toLowerCase())) {
      seen.add(cleaned.toLowerCase());
      list.push(cleaned);
    }
  }
  return list;
}

export interface ReorderResult {
  reordered: InstagramRecord[];
  matchedItems: string[];
  unmatchedItems: string[];
}

/**
 * Reorder records based on custom Instagram links or usernames
 */
export function applyCustomOrder(
  records: InstagramRecord[],
  items: string[],
  mode: ReorderMode
): ReorderResult {
  if (items.length === 0) {
    return {
      reordered: records,
      matchedItems: [],
      unmatchedItems: []
    };
  }

  // Build priority map
  const priorityMap = new Map<string, number>();

  if (mode === 'link') {
    items.forEach((item, idx) => {
      const id = extractInstagramIdentifier(item).toLowerCase();
      if (id) {
        priorityMap.set(id, idx);
      }
    });
  } else {
    items.forEach((item, idx) => {
      const cleanUname = item.trim().replace(/^@+/, '').toLowerCase();
      if (cleanUname) {
        priorityMap.set(cleanUname, idx);
      }
    });
  }

  const matchedSet = new Set<string>();

  const indexed = records.map((record, origIndex) => {
    let key = '';
    if (mode === 'link') {
      key = extractInstagramIdentifier(record.videoLink).toLowerCase();
      // Check raw code as backup
      if (!priorityMap.has(key) && record.raw['code']) {
        const rawCodeKey = extractInstagramIdentifier(record.raw['code']).toLowerCase();
        if (priorityMap.has(rawCodeKey)) {
          key = rawCodeKey;
        }
      }
    } else {
      key = record.username.trim().replace(/^@+/, '').toLowerCase();
    }

    const rank = priorityMap.has(key) ? priorityMap.get(key)! : -1;
    if (rank !== -1) {
      matchedSet.add(key);
    }

    return {
      record,
      origIndex,
      rank
    };
  });

  indexed.sort((a, b) => {
    // Both in custom list
    if (a.rank !== -1 && b.rank !== -1) {
      if (a.rank !== b.rank) {
        return a.rank - b.rank;
      }
      return a.origIndex - b.origIndex;
    }
    // Only a is in custom list
    if (a.rank !== -1) return -1;
    // Only b is in custom list
    if (b.rank !== -1) return 1;
    // Neither in custom list -> preserve original order
    return a.origIndex - b.origIndex;
  });

  const matchedItems: string[] = [];
  const unmatchedItems: string[] = [];

  for (const item of items) {
    const key = mode === 'link'
      ? extractInstagramIdentifier(item).toLowerCase()
      : item.trim().replace(/^@+/, '').toLowerCase();

    if (matchedSet.has(key)) {
      matchedItems.push(item);
    } else {
      unmatchedItems.push(item);
    }
  }

  return {
    reordered: indexed.map((item) => item.record),
    matchedItems,
    unmatchedItems
  };
}

// Backward compatibility alias
export const parseCustomUsernameList = parseCustomInputList;
export const applyCustomUsernameOrder = (records: InstagramRecord[], usernames: string[]) =>
  applyCustomOrder(records, usernames, 'username');
