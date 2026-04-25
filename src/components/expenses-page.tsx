'use client';

import { useState } from 'react';
import { useBudgetStore, fmt } from '@/lib/budget-store';
import { EXPENSE_CATS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryList } from './category-list';
import { AddTransactionDialog } from './add-transaction-dialog';

export function ExpensesPage() {
  const { getMonthData, getSummary } = useBudgetStore();
  const monthData = getMonthData();
  const summary = getSummary();
  const [dialogOpen, setDialogOpen] = useState(false);

  const actualMap: Record<string, number> = {};
  monthData.transactions
    .filter((t) => t.type === 'Pengeluaran')
    .forEach((t) => {
      actualMap[t.cat] = (actualMap[t.cat] || 0) + t.amount;
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          🛒 Pengeluaran
        </h2>
        <Button onClick={() => setDialogOpen(true)} className="bg-forest hover:bg-forest-light">
          + Tambah Transaksi
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-danger">
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Total Aktual</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-danger">{fmt(summary.actualExpense)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Total Dianggarkan</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">{fmt(summary.budgetExpense)}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 text-lg font-semibold tracking-tight">Per Kategori</h3>
          <CategoryList cats={EXPENSE_CATS} type="expense" budgetMap={monthData.budgets.expense} actualMap={actualMap} />
        </CardContent>
      </Card>
      <AddTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType="Pengeluaran" />
    </div>
  );
}
