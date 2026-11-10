import { InstagramRecord } from '../types/instagram';

/**
 * Clean and parse custom username list from user text input (lines or commas)
 */
export function parseCustomUsernameList(rawText: string): string[] {
  if (!rawText.trim()) return [];

  const rawItems = rawText.split(/[\r\n,]+/);
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of rawItems) {
    const cleaned = item.trim().replace(/^@+/, '');
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
  matchedUsernames: string[];
  unmatchedUsernames: string[];
}

/**
 * Reorder records based on the user's custom username sequence.
 * - Posts belonging to custom usernames are placed first, in the exact custom order.
 * - If a custom username has multiple posts (duplicate usernames), they preserve original relative order.
 * - Posts not included in the custom list are placed at the end, preserving their original order.
 */
export function applyCustomUsernameOrder(
  records: InstagramRecord[],
  customUsernames: string[]
): ReorderResult {
  if (customUsernames.length === 0) {
    return {
      reordered: records,
      matchedUsernames: [],
      unmatchedUsernames: []
    };
  }

  // Create a priority map: lowercase username -> rank index (0, 1, 2, ...)
  const priorityMap = new Map<string, number>();
  customUsernames.forEach((uname, idx) => {
    priorityMap.set(uname.toLowerCase(), idx);
  });

  const matchedSet = new Set<string>();

  // Attach original index to guarantee stable sorting for duplicates and unlisted rows
  const indexed = records.map((record, origIndex) => {
    const cleanUname = record.username.trim().replace(/^@+/, '').toLowerCase();
    const rank = priorityMap.has(cleanUname) ? priorityMap.get(cleanUname)! : -1;
    if (rank !== -1) {
      matchedSet.add(cleanUname);
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
    // Neither is in custom list -> preserve original order
    return a.origIndex - b.origIndex;
  });

  const matchedUsernames: string[] = [];
  const unmatchedUsernames: string[] = [];

  for (const uname of customUsernames) {
    if (matchedSet.has(uname.toLowerCase())) {
      matchedUsernames.push(uname);
    } else {
      unmatchedUsernames.push(uname);
    }
  }

  return {
    reordered: indexed.map((item) => item.record),
    matchedUsernames,
    unmatchedUsernames
  };
}
