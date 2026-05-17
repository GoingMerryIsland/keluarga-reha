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

// ─── Google Sheets Export (copy to clipboard + open Sheets) ───────
export async function exportToGoogleSheets(rows: ReportRow[], filterLabel: string): Promise<boolean> {
  const headers = ['Bulan', 'Pendapatan', 'Pengeluaran', 'Tagihan', 'Cicilan', 'Tabungan', 'Sisa'];

  // Build tab-separated values (TSV) — Google Sheets pastes TSV perfectly into cells
  const tsvRows: string[] = [];
  tsvRows.push(headers.join('\t'));

  rows.forEach((r) => {
    tsvRows.push([r.label, r.income, r.expense, r.bill, r.debt, r.saving, r.balance].join('\t'));
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
  tsvRows.push(['TOTAL', totals.income, totals.expense, totals.bill, totals.debt, totals.saving, totals.balance].join('\t'));

  const tsvContent = tsvRows.join('\n');

  // Copy to clipboard
  try {
    await navigator.clipboard.writeText(tsvContent);
  } catch {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = tsvContent;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  // Open Google Sheets in new tab
  setTimeout(() => {
    window.open('https://sheets.google.com/create', '_blank');
  }, 300);

  return true;
}
