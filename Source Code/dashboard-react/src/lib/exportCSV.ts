/**
 * Download an array of objects as a CSV file.
 * Adds a BOM so Arabic characters render correctly in Excel.
 *
 * @param filename  Desired file name without extension (e.g. "orders")
 * @param rows      Array of flat objects — keys become column headers
 */
export const downloadCSV = (
  filename: string,
  rows: Record<string, unknown>[]
): void => {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);

  const escape = (val: unknown): string => {
    const str = String(val ?? '').replace(/"/g, '""');
    // Wrap in quotes if contains comma, newline or quote
    return /[",\n\r]/.test(str) ? `"${str}"` : str;
  };

  const lines = [
    headers.map(escape).join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ];

  // \ufeff = UTF-8 BOM for Microsoft Excel Arabic support
  const blob = new Blob(['\ufeff' + lines.join('\r\n')], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
