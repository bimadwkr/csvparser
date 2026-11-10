export type FollowerStatus = 'found' | 'not_found';

export interface FollowerRecord {
  id: string;
  username: string;
  userFullName: string;
  followersCount: number | null;
  followsCount: number | null;
  profilePic: string;
  profileUrl: string;
  userId: string;
  status: FollowerStatus;
  errorDescription: string;
  timestamp: string;
  raw: Record<string, string>;
}

export interface FollowerSummary {
  totalProfiles: number;
  foundProfiles: number;
  notFoundProfiles: number;
  totalFollowers: number;
  averageFollowers: number;
  totalFollowing: number;
}

export interface FollowerParseResult {
  fileName: string;
  fileSize: number;
  records: FollowerRecord[];
  totalRawRows: number;
}

export type FollowerSortField =
  | 'username'
  | 'userFullName'
  | 'followersCount'
  | 'followsCount'
  | 'profileUrl'
  | 'status'
  | null;
