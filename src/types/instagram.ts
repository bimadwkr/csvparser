export type MetricKey = 'username' | 'videoLink' | 'view' | 'like' | 'comment' | 'share' | 'bookmarks';

export interface InstagramRecord {
  id: string;
  username: string;
  videoLink: string;
  view: number | null;
  like: number | null;
  comment: number | null;
  share: number | null;
  bookmarks: number | null;
  raw: Record<string, string>;
}

export type ColumnMapping = Record<MetricKey, string>;

export interface MetricDefinition {
  key: MetricKey;
  label: string;
  outputName: string;
  aliases: string[];
  required?: boolean;
}

export interface MetricSummary {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalBookmarks: number;
  viewAvailableCount: number;
  likeAvailableCount: number;
  commentAvailableCount: number;
  shareAvailableCount: number;
  bookmarkAvailableCount: number;
  videoLinkCount: number;
}

export interface ParseResult {
  fileName: string;
  fileSize: number;
  headers: string[];
  records: InstagramRecord[];
  mapping: ColumnMapping;
  detectedWarnings: string[];
  totalRawRows: number;
}

export type SortField = MetricKey | null;
export type SortDirection = 'asc' | 'desc';
