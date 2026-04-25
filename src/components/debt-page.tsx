'use client';

import { useState, useEffect } from 'react';
import { useBudgetStore, fmt } from '@/lib/budget-store';
import { DEBT_CATS } from '@/lib/constants';
import type { Debt } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CategoryList } from './category-list';
import { AddTransactionDialog } from './add-transaction-dialog';
import { DebtDialog } from './debt-dialog';

export function DebtPage() {
  const { getMonthData, data, deleteDebt } = useBudgetStore();
  const monthData = getMonthData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [debtDialogOpen, setDebtDialogOpen] = useState(false);
  const [editDebt, setEditDebt] = useState<Debt | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const debts = data.debts || [];
  const totalPages = Math.ceil(debts.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedDebts = debts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const actualMap: Record<string, number> = {};
  monthData.transactions
    .filter((t) => t.type === 'Utang')
    .forEach((t) => { actualMap[t.cat] = (actualMap[t.cat] || 0) + t.amount; });

  const totalBudget = Object.values(monthData.budgets.debt).reduce((s, v) => s + v, 0);
  const totalActual = Object.values(actualMap).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">💳 Pembayaran Utang & Cicilan</h2>
        <Button onClick={() => setDialogOpen(true)} className="bg-forest hover:bg-forest-light">+ Tambah Cicilan</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Total Cicilan Bulan Ini</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-ocean">{fmt(totalBudget)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Sudah Dibayar</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-forest">{fmt(totalActual)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight">Daftar Hutang Aktif</h3>
            <Button onClick={() => { setEditDebt(null); setDebtDialogOpen(true); }} className="bg-ocean hover:bg-ocean-light">
              + Tambah Hutang
            </Button>
          </div>
          {debts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-ocean hover:bg-ocean">
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Nama / Keperluan</TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Kategori</TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Total Hutang</TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Lama Cicilan</TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wider text-white">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDebts.map((d) => (
                    <TableRow key={d.id} className="hover:bg-ocean-pale/50">
                      <TableCell className="text-sm font-semibold text-foreground">{d.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{d.category}</TableCell>
                      <TableCell className="text-sm font-bold text-foreground">{fmt(d.amount)}</TableCell>
                      <TableCell className="text-sm text-foreground">{d.months} Bulan</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setEditDebt(d); setDebtDialogOpen(true); }}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => {
                            if (confirm('Hapus hutang ini?')) {
                              deleteDebt(d.id);
                            }
                          }}>
                            Hapus
                          </Button>
                        </div>
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
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <div className="mb-3 text-4xl">💸</div>
              <p className="text-sm">Belum ada daftar hutang yang dicatat.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 text-lg font-semibold tracking-tight">Daftar Cicilan</h3>
          <CategoryList cats={DEBT_CATS} type="debt" budgetMap={monthData.budgets.debt} actualMap={actualMap} />
        </CardContent>
      </Card>
      <AddTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType="Utang" />
      <DebtDialog open={debtDialogOpen} onOpenChange={setDebtDialogOpen} editDebt={editDebt} />
    </div>
  );
}
