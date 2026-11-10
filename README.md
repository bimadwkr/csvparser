# Instagram Metrics Parser

A modern, fast, and privacy-first web application to parse raw Instagram scraping CSV files into clean, standardized performance reports.

## Features

- **100% Client-Side Processing**: No CSV files or data are uploaded to any external server.
- **Smart Column Detection**: Intelligently identifies nested and varying Instagram scraping metrics (`user/username`, `metrics/play_count`, `likesCount`, etc.) with case-insensitivity and alias normalization.
- **Custom Username Reordering (Reorder List)**:
  - Input or paste a custom sequence of usernames (with or without `@`, separated by lines or commas).
  - Automatically re-orders table rows and exported files according to your custom order.
  - One-click feature to populate current usernames from the CSV to easily rearrange them.
  - Posts not listed in the custom order remain preserved at the bottom.
- **Strict Metric Integrity**: 
  - Preserves `0` as `0`.
  - Missing metrics remain blank (never treated as false zeros).
  - Preserves duplicate usernames across separate posts and original ordering.
- **Interactive Data Table**:
  - Formatted numbers with thousand separators for display.
  - Full column sorting (ascending / descending) with missing values neatly positioned.
  - Instant username search filter.
  - Configurable pagination.
- **Summary Analytics**:
  - Total Posts, Total Views, Total Likes, Total Comments, Total Shares, and Total Bookmarks.
  - Clear count of available data points per metric.
- **Dual Export Options (Excel & CSV)**:
  - **Download Excel (.xlsx)**: Native spreadsheet file with configured column widths and numeric formats.
  - **Download CSV (.csv)**: UTF-8 BOM encoded for direct Microsoft Excel & Google Sheets compatibility without character corruption.
  - Both export the exact 6 standardized columns: `Username Instagram`, `View`, `Like`, `Comment`, `Share`, `Bookmarks`.

---

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm

### Setup & Run
1. Navigate to the project root:
   ```bash
   cd "C:\Users\bimad\OneDrive\Documents\CSV"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local URL (typically `http://localhost:5173`) in your browser.

---

## Production Build

To build the static production assets:
```bash
npm run build
```
The optimized bundle will be generated in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## Deploying to Vercel

### Option 1: Vercel CLI
1. Install the Vercel CLI globally (if not installed):
   ```bash
   npm install -g vercel
   ```
2. In the project directory, run:
   ```bash
   vercel
   ```
3. Follow the prompts (Framework Preset: **Vite**, Build Command: `npm run build`, Output Directory: `dist`).

### Option 2: Vercel Git Integration
1. Push this directory to a GitHub repository.
2. In your [Vercel Dashboard](https://vercel.com/dashboard), click **Add New > Project**.
3. Import your repository.
4. Framework preset **Vite** will be detected automatically.
5. Click **Deploy**.
