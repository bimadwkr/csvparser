# Build a Website: Instagram CSV Metrics Parser

Act as a senior full-stack developer and UI/UX designer. Build a fully functional, modern, responsive web application called **Instagram Metrics Parser**.

## 1. Project Objective

Create a web-based CSV parsing tool that allows users to upload raw CSV files containing Instagram post scraping data and automatically transform them into a clean, standardized Instagram performance report.

The application should be similar to a lightweight data processing dashboard.

The primary workflow:

1. User uploads a raw Instagram CSV file.
2. The system reads and analyzes the CSV structure.
3. The parser automatically identifies relevant Instagram metrics.
4. The application transforms the raw data into a clean table.
5. User can preview, search, sort, and filter the parsed data.
6. User downloads the cleaned result as a CSV file.

All processing should happen locally in the browser. Do not upload user files to an external server.

## 2. Input CSV Structure

The application must support CSV files with different column names and structures.

The source CSV may contain many columns, but the parser should extract only these metrics:

| Output Column | Possible Source Column Names |
|---|---|
| Username Instagram | username, ownerUsername, owner_username, authorUsername |
| View | play_count, playCount, videoPlayCount, video_view_count, viewCount, views |
| Like | likesCount, likes_count, like_count, likes |
| Comment | commentsCount, comments_count, comment_count, comments |
| Share | sharesCount, shares_count, share_count, shares |
| Bookmarks | bookmarksCount, bookmarks_count, savedCount, save_count, bookmarks |

Important:
- The parser must intelligently detect column names, including different naming conventions.
- Column matching should be case-insensitive.
- Support snake_case, camelCase, and similar variations.
- Preserve the original username without modifying it.
- If a metric is missing, display an empty value instead of zero.
- Do not invent missing metrics.
- If a metric is available but its value is 0, display 0.
- Do not treat missing values as zero.
- Handle numeric values correctly, including large numbers.

## 3. Output Table

The output must contain exactly these six columns, in this order:

1. Username Instagram
2. View
3. Like
4. Comment
5. Share
6. Bookmarks

Example output:

| Username Instagram | View | Like | Comment | Share | Bookmarks |
|---|---:|---:|---:|---:|---:|
| mumut.story | 1208 | | 15 | 85 | 6 |
| pamanjalanjalan | 50102 | 741 | 30 | 428 | 768 |
| masway___ | 1898 | 85 | 2 | 8 | 15 |
| vionaaamiraa | 368 | | 0 | 0 | 1 |

The displayed table should:
- Have a clean and readable layout.
- Format numbers with thousand separators for readability.
- Support horizontal scrolling on smaller screens.
- Use sticky table headers where appropriate.
- Support sorting by every metric.
- Support searching usernames.
- Show the total number of parsed records.
- Display a clear empty state if there is no data.

Important: Keep the downloaded CSV values as raw numbers without display formatting. For example, display 50,102 in the table but export 50102 in the CSV.

## 4. Website UI/UX Design

Create a premium SaaS-style dashboard.

Design direction:
- Minimalist.
- Modern.
- Clean typography.
- White or subtle off-white background.
- Dark charcoal text.
- Subtle borders and shadows.
- Rounded cards.
- Professional data dashboard aesthetic.
- Responsive desktop and mobile layouts.

Suggested layout:

### Header
- Logo/icon: Instagram-inspired analytics icon.
- Product name: Instagram Metrics Parser.
- Small subtitle: "Transform raw Instagram data into clean performance reports."

### Upload Section

Create a large drag-and-drop upload area.

Features:
- Drag and drop CSV files.
- Browse files button.
- Accept `.csv` files.
- Show uploaded filename.
- Show file size.
- Show upload status.
- Allow replacing the uploaded file.

Add helper text:
"Upload your Instagram scraping CSV file to automatically extract post performance metrics."

### Processing Section

After uploading:
- Automatically parse the CSV.
- Detect the relevant columns.
- Display processing status.
- Show success or error notifications.
- Do not require the user to manually configure columns for standard supported formats.

### Summary Cards

After successful parsing, display:

- Total Posts
- Total Views
- Total Likes
- Total Comments
- Total Shares
- Total Bookmarks

For summary calculations:
- Sum available numeric values.
- Do not count missing values as zero in the individual record.
- Clearly indicate that totals are calculated from available data.

### Data Table

Display the six standardized columns.

Include:
- Search username.
- Sort ascending/descending.
- Row count.
- Pagination (optional).
- Clear table styling.
- Responsive behavior.

### Download Section

Add a prominent button:

"Download Clean CSV"

When clicked:
- Generate a new CSV containing only the six standardized columns.
- Exclude all irrelevant source columns.
- Preserve all parsed rows.
- Preserve blank values as blank.
- Export numeric values without thousand separators.
- Use UTF-8 encoding with BOM for Excel compatibility.
- Generate a filename such as `instagram_metrics_clean_YYYY-MM-DD.csv`.

Also add a secondary action:
"Upload Another File"

## 5. CSV Parsing Requirements

Use a reliable CSV parsing library such as PapaParse.

Requirements:
- Handle quoted CSV values.
- Handle commas inside quoted text.
- Handle different line endings.
- Handle UTF-8 characters.
- Handle empty cells.
- Handle files with hundreds or thousands of rows.
- Handle malformed CSV files gracefully.
- Display meaningful error messages.

Do not use simple string splitting with `split(",")` to parse CSV.

### Column Detection Logic

Build a reusable column-mapping utility.

Example:

```javascript
const columnAliases = {
  username: [
    "username",
    "ownerUsername",
    "owner_username",
    "authorUsername"
  ],
  view: [
    "play_count",
    "playCount",
    "videoPlayCount",
    "video_view_count",
    "viewCount",
    "views"
  ],
  like: [
    "likesCount",
    "likes_count",
    "like_count",
    "likes"
  ],
  comment: [
    "commentsCount",
    "comments_count",
    "comment_count",
    "comments"
  ],
  share: [
    "sharesCount",
    "shares_count",
    "share_count",
    "shares"
  ],
  bookmarks: [
    "bookmarksCount",
    "bookmarks_count",
    "savedCount",
    "save_count",
    "bookmarks"
  ]
};
```

Normalize column names before matching:
- Convert to lowercase.
- Remove spaces and special characters.
- Normalize underscores and camelCase.
- Match against known aliases.

Avoid ambiguous matching. For example, do not accidentally use followerCount as a post view metric.

If a required field cannot be detected:
- Continue parsing other available fields.
- Show a warning indicating which metrics were not found.
- Do not fabricate values.
- Allow the user to manually map columns if automatic detection fails.

## 6. Technical Stack

Preferred stack:
- React
- Vite
- TypeScript
- Tailwind CSS
- PapaParse
- Lucide React icons

Use lightweight libraries and avoid unnecessary dependencies.

The application should be:
- Fully client-side.
- Fast.
- Easy to maintain.
- Easy to deploy to Vercel or Netlify.
- No database required.
- No authentication required.

## 7. Additional Features

Implement these useful features:

1. **Column Mapping**
   - Let users manually map source columns to the six output fields.
   - Useful when CSV column names are unfamiliar.

2. **Duplicate Username Support**
   - Do not automatically remove duplicate usernames.
   - Each row represents a separate Instagram post.
   - Preserve original row order.

3. **Data Validation**
   - Detect invalid numeric values.
   - Avoid converting invalid or missing values into misleading metrics.
   - Display warnings when necessary.

4. **Reset Function**
   - Clear uploaded file and parsed data.
   - Allow the user to start over.

5. **Privacy Notice**
   - Display: "Your files are processed locally in your browser. No data is uploaded to our servers."

## 8. Project Structure

Organize the project cleanly:

```text
src/
  components/
    Header.tsx
    FileUploader.tsx
    SummaryCards.tsx
    DataTable.tsx
    ColumnMapper.tsx
    DownloadButton.tsx
  utils/
    csvParser.ts
    columnMapper.ts
    csvExporter.ts
    formatters.ts
  types/
    instagram.ts
  App.tsx
  main.tsx
```

Keep parsing, mapping, formatting, and exporting logic separated from UI components.

## 9. Quality Assurance

Before completing the project, test:

- Uploading a valid Instagram CSV.
- Uploading an empty CSV.
- Uploading a malformed CSV.
- Handling missing metrics.
- Handling zero values.
- Handling duplicate usernames.
- Handling large numeric values.
- Searching usernames.
- Sorting metrics.
- Downloading the clean CSV.
- Re-uploading another file.
- Responsive mobile layout.

Make sure the downloaded CSV can be opened correctly in Microsoft Excel and Google Sheets.

## 10. Final Instructions

First inspect the existing project directory and its current setup.

If a project already exists, preserve its working configuration and integrate the application into it.

If the directory is empty, initialize a new React + Vite + TypeScript project.

Do not just create a visual prototype. Implement all functionality.

Do not leave placeholder buttons or mock data in the final application.

Prioritize a polished UI, reliable CSV parsing, accurate column detection, and correct CSV export.

After implementation:
1. Run the application.
2. Test the complete upload-to-download workflow.
3. Fix any errors.
4. Explain how to run the project locally.
5. Provide deployment instructions for Vercel.