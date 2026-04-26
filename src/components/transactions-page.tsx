'use client';

import { useState, useMemo, useEffect } from 'react';
import { useBudgetStore, fmt } from '@/lib/budget-store';
import { ALL_CATS, INCOME_CATS, EXPENSE_CATS, BILL_CATS, DEBT_CATS, SAVING_CATS } from '@/lib/constants';
import type { TransactionType } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { AddTransactionDialog } from './add-transaction-dialog';
import { ConfirmDialog } from './ui/confirm-dialog';
import { cn } from '@/lib/utils';

const badgeStyles: Record<string, string> = {
  Pendapatan: 'bg-forest-pale text-forest border-0',
  Pengeluaran: 'bg-danger-pale text-danger border-0',
  Tagihan: 'bg-ocean-pale text-ocean border-0',
  Utang: 'bg-amber-pale text-amber border-0',
  Tabungan: 'bg-ocean-pale text-ocean border-0',
};

export function TransactionsPage() {
  const { getMonthData, deleteTransaction } = useBudgetStore();
  const monthData = getMonthData();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const allCats = useMemo(
    () => [...INCOME_CATS, ...EXPENSE_CATS, ...BILL_CATS, ...DEBT_CATS, ...SAVING_CATS],
    []
  );

  const filteredTxs = useMemo(() => {
    let txs = [...monthData.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (filterType) txs = txs.filter((t) => t.type === filterType);
    if (filterCat) txs = txs.filter((t) => t.cat === filterCat);
    if (search) {
      const q = search.toLowerCase();
      txs = txs.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.note || '').toLowerCase().includes(q)
      );
    }
    return txs;
  }, [monthData.transactions, filterType, filterCat, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterCat, search, monthData.transactions]);

  const totalPages = Math.ceil(filteredTxs.length / itemsPerPage);
  const paginatedTxs = filteredTxs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          📝 Daftar Transaksi
        </h2>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-forest hover:bg-forest-light"
        >
          + Tambah Transaksi
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Select value={filterType} onValueChange={(v) => setFilterType(v ?? '')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="Pendapatan">Pendapatan</SelectItem>
              <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
              <SelectItem value="Tagihan">Tagihan</SelectItem>
              <SelectItem value="Utang">Utang</SelectItem>
              <SelectItem value="Tabungan">Tabungan</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCat} onValueChange={(v) => setFilterCat(v ?? '')}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {allCats.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="🔍 Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
        </CardContent>
      </Card>

      {/* Transaction Table */}
      <div className="pt-2">
        {filteredTxs.length > 0 ? (
            <>
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Tanggal</TableHead>
                  <TableHead className="w-[30%]">Transaksi</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                  {paginatedTxs.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-sm text-foreground">{t.date}</TableCell>
                      <TableCell className="text-sm font-semibold text-foreground">{t.name}</TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', badgeStyles[t.type])}>
                          {t.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{t.cat}</TableCell>
                      <TableCell className="text-sm font-bold text-foreground">
                        {t.type === 'Pendapatan' ? '+' : '-'} {fmt(t.amount)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {t.note || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setTxToDelete(t.id);
                            setConfirmOpen(true);
                          }}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Selanjutnya
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-muted-foreground rounded-[2rem] border-2 border-dashed">
              <div className="mb-3 text-5xl">📭</div>
              <p className="text-sm text-muted-foreground">Belum ada transaksi. Tambahkan transaksi pertama Anda!</p>
            </div>
          )}
      </div>

      <AddTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultType="Pengeluaran"
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Hapus Transaksi"
        description="Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={() => {
          if (txToDelete) {
            deleteTransaction(txToDelete);
            setTxToDelete(null);
          }
        }}
      />
    </div>
  );
}
