'use client';

import { useState, useMemo } from 'react';
import { useBudgetStore, fmt, parseKey } from '@/lib/budget-store';
import { MONTHS, YEARS } from '@/lib/constants';
import { exportToPDF, exportToExcel, exportToGoogleSheets } from '@/lib/report-export';
import type { ReportRow } from '@/lib/report-export';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { FileText, Sheet, FileSpreadsheet, Trash2, Download } from 'lucide-react';

export function ReportPage() {
  const { data, getSummary, curKey, deleteMonthData } = useBudgetStore();

  // Filters
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  const allKeys = Object.keys(data.months).sort();

  // Filtered keys
  const filteredKeys = useMemo(() => {
    return allKeys.filter((key) => {
      const { m, y } = parseKey(key);
      if (filterYear !== 'all' && y !== Number(filterYear)) return false;
      if (filterMonth !== 'all' && m !== Number(filterMonth)) return false;
      return true;
    });
  }, [allKeys, filterYear, filterMonth]);

  // Build report rows for export
  const reportRows: ReportRow[] = useMemo(() => {
    return filteredKeys.map((key) => {
      const { m, y } = parseKey(key);
      const ms = getSummary(key);
      return {
        key,
        label: `${MONTHS[m]} ${y}`,
        income: ms.actualIncome,
        expense: ms.actualExpense,
        bill: ms.actualBill,
        debt: ms.actualDebt,
        saving: ms.actualSaving,
        balance: ms.sisa,
      };
    });
  }, [filteredKeys, getSummary]);

  // Current period summary for tips
  const s = getSummary();

  // Financial tips
  const tips: { type: 'success' | 'warning' | 'danger'; msg: string }[] = [];
  if (s.actualExpense > s.budgetExpense)
    tips.push({ type: 'danger', msg: '⚠️ Pengeluaran melebihi anggaran bulan ini. Evaluasi pengeluaran yang tidak perlu.' });
  if (s.sisa < 0)
    tips.push({ type: 'danger', msg: '🚨 Saldo negatif! Total pengeluaran lebih besar dari pendapatan.' });
  if (s.actualIncome > 0 && s.actualSaving / s.actualIncome < 0.1)
    tips.push({ type: 'warning', msg: '💡 Tabungan kurang dari 10% pendapatan. Coba terapkan aturan 50-30-20.' });
  if (s.sisa > 0 && s.actualSaving === 0)
    tips.push({ type: 'warning', msg: '💡 Anda punya sisa saldo. Pertimbangkan untuk menabung atau investasi.' });
  if (s.actualExpense <= s.budgetExpense && s.actualIncome > 0)
    tips.push({ type: 'success', msg: '✅ Pengeluaran masih dalam batas anggaran. Pertahankan!' });

  const alertVariant = (type: string) => {
    if (type === 'danger') return 'destructive' as const;
    return 'default' as const;
  };

  const alertBg = (type: string) => {
    if (type === 'success') return 'bg-forest-pale border-forest-light text-forest';
    if (type === 'warning') return 'bg-amber-pale border-amber text-amber';
    return '';
  };

  // Filter label for export filenames
  const filterLabel = useMemo(() => {
    const yearText = filterYear === 'all' ? 'Semua Tahun' : filterYear;
    const monthText = filterMonth === 'all' ? 'Semua Bulan' : MONTHS[Number(filterMonth)];
    if (filterYear === 'all' && filterMonth === 'all') return 'Semua Periode';
    if (filterMonth === 'all') return `Tahun ${yearText}`;
    if (filterYear === 'all') return `Bulan ${monthText}`;
    return `${monthText} ${yearText}`;
  }, [filterYear, filterMonth]);

  const handleExportPDF = () => {
    if (reportRows.length === 0) { alert('Tidak ada data untuk di-export.'); return; }
    exportToPDF(reportRows, filterLabel);
  };

  const handleExportExcel = () => {
    if (reportRows.length === 0) { alert('Tidak ada data untuk di-export.'); return; }
    exportToExcel(reportRows, filterLabel);
  };

  const handleExportGSheets = () => {
    if (reportRows.length === 0) { alert('Tidak ada data untuk di-export.'); return; }
    exportToGoogleSheets(reportRows, filterLabel);
  };

  const handleDelete = (key: string) => {
    const { m, y } = parseKey(key);
    const label = `${MONTHS[m]} ${y}`;
    if (confirm(`Hapus data bulan ${label}?\n\nSemua transaksi dan anggaran bulan ini akan dihapus permanen.`)) {
      deleteMonthData(key);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight">📈 Laporan Keuangan</h2>

      {/* Filter & Export Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Tahun</span>
                <Select value={filterYear} onValueChange={(v) => setFilterYear(v ?? 'all')}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Semua Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Bulan</span>
                <Select value={filterMonth} onValueChange={(v) => setFilterMonth(v ?? 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Semua Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Bulan</SelectItem>
                    {MONTHS.map((name, i) => (
                      <SelectItem key={i} value={String(i)}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                <Download className="h-3.5 w-3.5" />
                Export
              </span>
              <Button
                variant="outline"
                onClick={handleExportPDF}
                className="gap-1.5 border-danger/30 text-danger hover:bg-danger-pale hover:text-danger"
              >
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleExportExcel}
                className="gap-1.5 border-forest/30 text-forest hover:bg-forest-pale hover:text-forest"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
              <Button
                variant="outline"
                onClick={handleExportGSheets}
                className="gap-1.5 border-ocean/30 text-ocean hover:bg-ocean-pale hover:text-ocean"
              >
                <Sheet className="h-4 w-4" />
                Google Sheets
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Table */}
      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 text-lg font-semibold tracking-tight">
            Ringkasan Per Bulan
            {filterLabel !== 'Semua Periode' && (
              <span className="ml-2 rounded-full bg-forest-pale px-2.5 py-0.5 text-xs font-medium text-forest">
                {filterLabel}
              </span>
            )}
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-forest hover:bg-forest">
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Bulan</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Pendapatan</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Pengeluaran</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Tagihan</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Cicilan</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Tabungan</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Sisa</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-white text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeys.length > 0 ? filteredKeys.map((key) => {
                  const { m, y } = parseKey(key);
                  const ms = getSummary(key);
                  const isCurrent = key === curKey();
                  return (
                    <TableRow key={key} className={cn('hover:bg-forest-pale/50', isCurrent && 'bg-forest-pale/30')}>
                      <TableCell className="text-sm font-semibold text-foreground">
                        {MONTHS[m]} {y}
                        {isCurrent && (
                          <span className="ml-2 inline-block rounded bg-forest/10 px-1.5 py-0.5 text-[0.65rem] font-medium text-forest">
                            Aktif
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-forest">{fmt(ms.actualIncome)}</TableCell>
                      <TableCell className="text-sm text-danger">{fmt(ms.actualExpense)}</TableCell>
                      <TableCell className="text-sm text-foreground">{fmt(ms.actualBill)}</TableCell>
                      <TableCell className="text-sm text-foreground">{fmt(ms.actualDebt)}</TableCell>
                      <TableCell className="text-sm text-gold">{fmt(ms.actualSaving)}</TableCell>
                      <TableCell className={cn('text-sm font-bold', ms.sisa >= 0 ? 'text-forest' : 'text-danger')}>{fmt(ms.sisa)}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          className="text-muted-foreground hover:bg-danger-pale hover:text-danger"
                          onClick={() => handleDelete(key)}
                          aria-label={`Hapus data ${MONTHS[m]} ${y}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                      <div className="mb-2 text-4xl">📊</div>
                      <p className="text-sm text-muted-foreground">
                        {allKeys.length === 0
                          ? 'Belum ada data. Tambahkan transaksi terlebih dahulu.'
                          : 'Tidak ada data untuk filter yang dipilih.'
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Financial Tips */}
      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 text-lg font-semibold tracking-tight">Catatan &amp; Tips Keuangan</h3>
          {tips.length > 0 ? (
            <div className="space-y-3">
              {tips.map((t, i) => (
                <Alert key={i} variant={alertVariant(t.type)} className={alertBg(t.type)}>
                  <AlertDescription className="text-sm leading-relaxed">{t.msg}</AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Tambahkan transaksi untuk mendapatkan tips keuangan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
