'use client';

import { useState, useEffect } from 'react';
import { useBudgetStore, fmt } from '@/lib/budget-store';
import { DEBT_CATS } from '@/lib/constants';
import type { Debt } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryList } from './category-list';
import { AddTransactionDialog } from './add-transaction-dialog';

export function DebtPage() {
  const { getMonthData } = useBudgetStore();
  const monthData = getMonthData();
  const [dialogOpen, setDialogOpen] = useState(false);

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
          <h3 className="mb-4 text-lg font-semibold tracking-tight">Daftar Cicilan</h3>
          <CategoryList cats={DEBT_CATS} type="debt" budgetMap={monthData.budgets.debt} actualMap={actualMap} />
        </CardContent>
      </Card>
      <AddTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType="Utang" />
    </div>
  );
}
