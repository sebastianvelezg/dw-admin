/**
 * Utility functions for exporting data to various formats
 */

/**
 * Convert an array of objects to CSV format
 */
export function convertToCSV<T extends Record<string, unknown>>(data: T[]): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvRows = []

  // Add header row
  csvRows.push(headers.join(','))

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(value ?? '').replace(/"/g, '""')
      return escaped.includes(',') ? `"${escaped}"` : escaped
    })
    csvRows.push(values.join(','))
  }

  return csvRows.join('\n')
}

/**
 * Download CSV file
 */
export function downloadCSV(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export data to CSV file
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string
): void {
  const csv = convertToCSV(data)
  downloadCSV(csv, filename)
}

/**
 * Format date for export
 */
export function formatDateForExport(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES')
}
