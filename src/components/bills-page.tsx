'use client';

import { useState, useEffect } from 'react';
import { useBudgetStore, fmt } from '@/lib/budget-store';
import { BILL_CATS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryList } from './category-list';
import { AddTransactionDialog } from './add-transaction-dialog';

export function BillsPage() {
  const { getMonthData } = useBudgetStore();
  const monthData = getMonthData();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Auto-open add dialog when navigated via FAB
  useEffect(() => {
    const pending = useBudgetStore.getState().pendingAddAction;
    if (pending) {
      setDialogOpen(true);
      useBudgetStore.getState().clearPendingAdd();
    }
  }, []);

  const actualMap: Record<string, number> = {};
  monthData.transactions
    .filter((t) => t.type === 'Tagihan')
    .forEach((t) => { actualMap[t.cat] = (actualMap[t.cat] || 0) + t.amount; });

  const totalBudget = Object.values(monthData.budgets.bill).reduce((s, v) => s + v, 0);
  const totalActual = Object.values(actualMap).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight">📋 Tagihan Rutin</h2>
        <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto bg-forest hover:bg-forest-light">+ Tambah Tagihan</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-ocean">
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Total Tagihan</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-ocean">{fmt(totalBudget)}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-forest">
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Sudah Dibayar</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-forest">{fmt(totalActual)}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-danger">
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Belum Dibayar</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-danger">{fmt(Math.max(0, totalBudget - totalActual))}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 text-lg font-semibold tracking-tight">Daftar Tagihan</h3>
          <CategoryList cats={BILL_CATS} type="bill" budgetMap={monthData.budgets.bill} actualMap={actualMap} />
        </CardContent>
      </Card>
      <AddTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType="Tagihan" />
    </div>
  );
}
