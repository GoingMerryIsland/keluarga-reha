import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface ReportRow {
  key: string;
  label: string;
  income: number;
  expense: number;
  bill: number;
  debt: number;
  saving: number;
  balance: number;
}

function fmtNum(n: number): string {
  return 'Rp ' + Math.abs(n).toLocaleString('id-ID');
}

// ─── PDF Export ───────────────────────────────────────────────────
export function exportToPDF(rows: ReportRow[], filterLabel: string) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Title
  doc.setFontSize(18);
  doc.setTextColor(45, 90, 61); // forest green
  doc.text('Reha Budget Report', 14, 18);

  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Periode: ${filterLabel}`, 14, 25);
  doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 30);

  // Table
  const headers = ['Bulan', 'Pendapatan', 'Pengeluaran', 'Tagihan', 'Cicilan', 'Tabungan', 'Sisa'];
  const body = rows.map((r) => [
    r.label,
    fmtNum(r.income),
    fmtNum(r.expense),
    fmtNum(r.bill),
    fmtNum(r.debt),
    fmtNum(r.saving),
    fmtNum(r.balance),
  ]);

  // Totals row
  const totals = rows.reduce(
    (acc, r) => ({
      income: acc.income + r.income,
      expense: acc.expense + r.expense,
      bill: acc.bill + r.bill,
      debt: acc.debt + r.debt,
      saving: acc.saving + r.saving,
      balance: acc.balance + r.balance,
    }),
    { income: 0, expense: 0, bill: 0, debt: 0, saving: 0, balance: 0 }
  );

  body.push([
    'TOTAL',
    fmtNum(totals.income),
    fmtNum(totals.expense),
    fmtNum(totals.bill),
    fmtNum(totals.debt),
    fmtNum(totals.saving),
    fmtNum(totals.balance),
  ]);

  autoTable(doc, {
    startY: 35,
    head: [headers],
    body,
    theme: 'grid',
    headStyles: {
      fillColor: [45, 90, 61],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 240, 232] },
    // Style the last row (totals) differently
    didParseCell(data) {
      if (data.section === 'body' && data.row.index === body.length - 1) {
        data.cell.styles.fillColor = [45, 90, 61];
        data.cell.styles.textColor = 255;
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`Laporan-Keuangan-${filterLabel.replace(/\s+/g, '-')}.pdf`);
}

// ─── Excel Export ─────────────────────────────────────────────────
export function exportToExcel(rows: ReportRow[], filterLabel: string) {
  const headers = ['Bulan', 'Pendapatan', 'Pengeluaran', 'Tagihan', 'Cicilan', 'Tabungan', 'Sisa'];

  // Title rows
  const wsData: (string | number)[][] = [
    ['Reha Budget Report'],
    [`Periode: ${filterLabel}`],
    [], // blank row
    headers,
  ];

  // Data rows
  rows.forEach((r) => {
    wsData.push([r.label, r.income, r.expense, r.bill, r.debt, r.saving, r.balance]);
  });

  // Totals
  const totals = rows.reduce(
    (acc, r) => ({
      income: acc.income + r.income,
      expense: acc.expense + r.expense,
      bill: acc.bill + r.bill,
      debt: acc.debt + r.debt,
      saving: acc.saving + r.saving,
      balance: acc.balance + r.balance,
    }),
    { income: 0, expense: 0, bill: 0, debt: 0, saving: 0, balance: 0 }
  );
  wsData.push(['TOTAL', totals.income, totals.expense, totals.bill, totals.debt, totals.saving, totals.balance]);

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Auto-width columns
  const colWidths = headers.map((h, i) => {
    let maxLen = h.length;
    wsData.forEach((row) => {
      const cell = row[i];
      if (cell != null) {
        const len = typeof cell === 'number' ? fmtNum(cell).length : String(cell).length;
        if (len > maxLen) maxLen = len;
      }
    });
    return { wch: Math.max(maxLen + 2, 14) };
  });
  ws['!cols'] = colWidths;

  // Merge title cell
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan');
  XLSX.writeFile(wb, `Laporan-Keuangan-${filterLabel.replace(/\s+/g, '-')}.xlsx`);
}

// ─── Google Sheets Export (CSV download — opens natively in Sheets on mobile) ─
export function exportToGoogleSheets(rows: ReportRow[], filterLabel: string) {
  const headers = ['Bulan', 'Pendapatan', 'Pengeluaran', 'Tagihan', 'Cicilan', 'Tabungan', 'Sisa'];

  const csvRows: string[] = [];
  csvRows.push(headers.join(','));

  rows.forEach((r) => {
    // Quote the label in case it contains commas
    const label = r.label.includes(',') ? `"${r.label}"` : r.label;
    csvRows.push([label, r.income, r.expense, r.bill, r.debt, r.saving, r.balance].join(','));
  });

  // Totals
  const totals = rows.reduce(
    (acc, r) => ({
      income: acc.income + r.income,
      expense: acc.expense + r.expense,
      bill: acc.bill + r.bill,
      debt: acc.debt + r.debt,
      saving: acc.saving + r.saving,
      balance: acc.balance + r.balance,
    }),
    { income: 0, expense: 0, bill: 0, debt: 0, saving: 0, balance: 0 }
  );
  csvRows.push(['TOTAL', totals.income, totals.expense, totals.bill, totals.debt, totals.saving, totals.balance].join(','));

  // UTF-8 BOM for proper encoding + CRLF for compatibility
  const BOM = '\uFEFF';
  const csvContent = BOM + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `Laporan-Keuangan-${filterLabel.replace(/\s+/g, '-')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
