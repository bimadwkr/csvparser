import { ColumnMapping, MetricDefinition } from '../types/instagram';

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    key: 'username',
    label: 'Username Instagram',
    outputName: 'Username Instagram',
    required: true,
    aliases: [
      'user/username',
      'username',
      'ownerusername',
      'owner_username',
      'authorusername',
      'author_username',
      'profile_name',
      'handle'
    ]
  },
  {
    key: 'view',
    label: 'View',
    outputName: 'View',
    aliases: [
      'metrics/play_count',
      'metrics/view_count',
      'play_count',
      'playcount',
      'videoplaycount',
      'video_play_count',
      'video_view_count',
      'videoviewcount',
      'viewcount',
      'views',
      'metrics/ig_play_count'
    ]
  },
  {
    key: 'like',
    label: 'Like',
    outputName: 'Like',
    aliases: [
      'metrics/like_count',
      'likescount',
      'likes_count',
      'like_count',
      'likecount',
      'likes',
      'metrics/ig_like_count'
    ]
  },
  {
    key: 'comment',
    label: 'Comment',
    outputName: 'Comment',
    aliases: [
      'metrics/comment_count',
      'commentscount',
      'comments_count',
      'comment_count',
      'commentcount',
      'comments',
      'metrics/ig_comment_count'
    ]
  },
  {
    key: 'share',
    label: 'Share',
    outputName: 'Share',
    aliases: [
      'metrics/share_count',
      'sharescount',
      'shares_count',
      'share_count',
      'sharecount',
      'shares'
    ]
  },
  {
    key: 'bookmarks',
    label: 'Bookmarks',
    outputName: 'Bookmarks',
    aliases: [
      'metrics/save_count',
      'bookmarkscount',
      'bookmarks_count',
      'savedcount',
      'saved_count',
      'save_count',
      'savecount',
      'bookmarks',
      'saved',
      'metrics/bookmark_count'
    ]
  }
];

// Disallowed substring patterns to avoid false positives (e.g. follower counts, flags, settings)
const DISALLOWED_PATTERNS: RegExp[] = [
  /follower/i,
  /following/i,
  /media_count/i,
  /enabled/i,
  /disabled/i,
  /decision/i,
  /treatment/i,
  /can_/i,
  /has_/i,
  /is_/i,
  /url/i,
  /preview/i,
  /duration/i,
  /subtitle/i,
  /title/i
];

/**
 * Clean a column name for comparison
 */
export function normalizeColumnName(name: string): string {
  return name.trim().toLowerCase().replace(/[\s\-_.]/g, '');
}

/**
 * Intelligent detector for Instagram metric columns in raw CSV headers
 */
export function detectColumnMapping(headers: string[]): {
  mapping: ColumnMapping;
  warnings: string[];
} {
  const mapping: ColumnMapping = {
    username: '',
    view: '',
    like: '',
    comment: '',
    share: '',
    bookmarks: ''
  };

  const warnings: string[] = [];

  for (const def of METRIC_DEFINITIONS) {
    let matchedHeader = '';

    // 1. Try exact match (case-insensitive) against aliases
    for (const alias of def.aliases) {
      const found = headers.find(
        (h) => h.trim().toLowerCase() === alias.toLowerCase()
      );
      if (found) {
        matchedHeader = found;
        break;
      }
    }

    // 2. Try normalized match (ignoring separators, casing)
    if (!matchedHeader) {
      for (const alias of def.aliases) {
        const normAlias = normalizeColumnName(alias);
        const found = headers.find((h) => {
          // Check disallowed patterns first
          if (DISALLOWED_PATTERNS.some((p) => p.test(h))) return false;
          return normalizeColumnName(h) === normAlias;
        });
        if (found) {
          matchedHeader = found;
          break;
        }
      }
    }

    // 3. Try matching leaf segments (e.g. "metrics/play_count" -> "play_count")
    if (!matchedHeader) {
      for (const alias of def.aliases) {
        const leafAlias = alias.split('/').pop() || alias;
        const normLeaf = normalizeColumnName(leafAlias);
        const found = headers.find((h) => {
          if (DISALLOWED_PATTERNS.some((p) => p.test(h))) return false;
          const leafH = h.split('/').pop() || h;
          return normalizeColumnName(leafH) === normLeaf;
        });
        if (found) {
          matchedHeader = found;
          break;
        }
      }
    }

    if (matchedHeader) {
      mapping[def.key] = matchedHeader;
    } else {
      warnings.push(`Metric "${def.label}" was not automatically detected.`);
    }
  }

  return { mapping, warnings };
}
