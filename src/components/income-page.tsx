'use client';

import { useState, useEffect } from 'react';
import { useBudgetStore, fmt } from '@/lib/budget-store';
import { INCOME_CATS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryList } from './category-list';
import { AddTransactionDialog } from './add-transaction-dialog';

export function IncomePage() {
  const { getMonthData, getSummary } = useBudgetStore();
  const monthData = getMonthData();
  const summary = getSummary();
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
    .filter((t) => t.type === 'Pendapatan')
    .forEach((t) => {
      actualMap[t.cat] = (actualMap[t.cat] || 0) + t.amount;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          💰 Pendapatan
        </h2>
        <Button
          onClick={() => setDialogOpen(true)}
          className="w-full sm:w-auto bg-forest hover:bg-forest-light"
        >
          + Tambah Sumber
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-forest">
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Total Pendapatan Aktual
            </div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-forest">
              {fmt(summary.actualIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Total Pendapatan Dianggarkan
            </div>
            <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {fmt(summary.budgetIncome)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <h3 className="mb-4 text-lg font-semibold tracking-tight">
            Sumber Pendapatan
          </h3>
          <CategoryList
            cats={INCOME_CATS}
            type="income"
            budgetMap={monthData.budgets.income}
            actualMap={actualMap}
          />
        </CardContent>
      </Card>

      <AddTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultType="Pendapatan"
      />
    </div>
  );
}
