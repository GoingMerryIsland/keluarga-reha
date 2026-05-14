'use client';

import { useState } from 'react';
import { useBudgetStore, fmt } from '@/lib/budget-store';
import { SAVING_CATS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryList } from './category-list';
import { AddTransactionDialog } from './add-transaction-dialog';

export function SavingsPage() {
  const { getMonthData } = useBudgetStore();
  const monthData = getMonthData();
  const [dialogOpen, setDialogOpen] = useState(false);

  const actualMap: Record<string, number> = {};
  monthData.transactions
    .filter((t) => t.type === 'Tabungan')
    .forEach((t) => { actualMap[t.cat] = (actualMap[t.cat] || 0) + t.amount; });

  const totalBudget = Object.values(monthData.budgets.saving).reduce((s, v) => s + v, 0);
  const totalActual = Object.values(actualMap).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight">🏦 Tabungan &amp; Investasi</h2>
        <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto bg-forest hover:bg-forest-light">+ Tambah Dana</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-gold">
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Total Tabungan Bulan Ini</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-gold">{fmt(totalActual)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Target Tabungan</div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">{fmt(totalBudget)}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 text-lg font-semibold tracking-tight">Dana Tabungan</h3>
          <CategoryList cats={SAVING_CATS} type="saving" budgetMap={monthData.budgets.saving} actualMap={actualMap} />
        </CardContent>
      </Card>
      <AddTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType="Tabungan" />
    </div>
  );
}
