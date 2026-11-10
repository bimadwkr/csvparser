import Papa from 'papaparse';
import { FollowerRecord, FollowerSummary, FollowerParseResult, FollowerStatus } from '../types/follower';

/**
 * Safely parse numeric string or null
 */
function parseCount(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const s = String(val).trim();
  if (!s) return null;
  const num = Number(s.replace(/,/g, ''));
  return isNaN(num) ? null : num;
}

/**
 * Clean username string
 */
export function cleanUsername(raw: string): string {
  if (!raw) return '';
  return raw.trim().replace(/^@+/, '');
}

/**
 * Convert raw CSV row into structured FollowerRecord
 */
export function buildFollowerRecord(row: Record<string, string>, index: number): FollowerRecord {
  const errorVal = (row['error'] || '').trim().toLowerCase();
  const errorDesc = (row['errorDescription'] || row['error_description'] || '').trim();

  // Determine status: 'not_found' if error flag or empty followers with error description
  const isNotFound = errorVal === 'not_found' || /not.*exist|not.*found/i.test(errorDesc);
  const status: FollowerStatus = isNotFound ? 'not_found' : 'found';

  // Extract username: prefer 'userName', fallback to 'username'
  const rawUsername = row['userName'] || row['username'] || row['user/username'] || '';
  const username = cleanUsername(rawUsername);

  // Extract Full Name
  const userFullName = (row['userFullName'] || row['fullName'] || row['full_name'] || '').trim();

  // Extract counts
  const followersCount = isNotFound ? null : parseCount(row['followersCount'] || row['followers_count'] || row['followers']);
  const followsCount = isNotFound ? null : parseCount(row['followsCount'] || row['follows_count'] || row['following']);

  // Extract URLs
  let profileUrl = (row['userUrl'] || row['url'] || '').trim();
  if (!profileUrl && username) {
    profileUrl = `https://www.instagram.com/${username}/`;
  }

  const profilePic = (row['profilePic'] || row['profile_pic'] || row['profile_pic_url'] || '').trim();
  const userId = (row['userId'] || row['user_id'] || row['id'] || '').trim();
  const timestamp = (row['timestamp'] || '').trim();

  return {
    id: `follower-row-${index + 1}`,
    username,
    userFullName,
    followersCount,
    followsCount,
    profilePic,
    profileUrl,
    userId,
    status,
    errorDescription: errorDesc,
    timestamp,
    raw: row
  };
}

/**
 * Calculate analytics for follower data
 */
export function calculateFollowerSummary(records: FollowerRecord[]): FollowerSummary {
  let foundProfiles = 0;
  let notFoundProfiles = 0;
  let totalFollowers = 0;
  let totalFollowing = 0;

  for (const r of records) {
    if (r.status === 'found') {
      foundProfiles++;
      if (r.followersCount !== null) {
        totalFollowers += r.followersCount;
      }
      if (r.followsCount !== null) {
        totalFollowing += r.followsCount;
      }
    } else {
      notFoundProfiles++;
    }
  }

  const averageFollowers = foundProfiles > 0 ? Math.round(totalFollowers / foundProfiles) : 0;

  return {
    totalProfiles: records.length,
    foundProfiles,
    notFoundProfiles,
    totalFollowers,
    averageFollowers,
    totalFollowing
  };
}

/**
 * Parse Follower CSV file
 */
export function parseFollowerCSV(file: File): Promise<FollowerParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          if (!results.data || results.data.length === 0) {
            reject(new Error(results.errors[0].message || 'Gagal memproses file CSV follower.'));
            return;
          }
        }

        const headers = results.meta.fields || [];
        if (headers.length === 0) {
          reject(new Error('File CSV tidak memiliki header.'));
          return;
        }

        const records = results.data.map((row, idx) => buildFollowerRecord(row, idx));

        resolve({
          fileName: file.name,
          fileSize: file.size,
          records,
          totalRawRows: results.data.length
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}
