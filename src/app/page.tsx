'use client';

import { useState, useEffect } from 'react';

import { useBudgetStore } from '@/lib/budget-store';
import { useThemeInit } from '@/lib/theme-store';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardPage } from '@/components/dashboard-page';
import { TransactionsPage } from '@/components/transactions-page';
import { IncomePage } from '@/components/income-page';
import { ExpensesPage } from '@/components/expenses-page';
import { BillsPage } from '@/components/bills-page';
import { DebtPage } from '@/components/debt-page';
import { ActiveDebtsPage } from '@/components/active-debts-page';
import { SavingsPage } from '@/components/savings-page';
import { ReportPage } from '@/components/report-page';

const pages: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  transactions: TransactionsPage,
  income: IncomePage,
  expenses: ExpensesPage,
  bills: BillsPage,
  debt: DebtPage,
  'active-debts': ActiveDebtsPage,
  savings: SavingsPage,
  report: ReportPage,
};

export default function Home() {
  useThemeInit();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const activePage = useBudgetStore((s) => s.activePage);
  const ActivePage = pages[activePage] || DashboardPage;

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="pt-16 md:pl-[260px]">
        <AppSidebar />
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6">
          <ActivePage />
        </main>
      </div>
    </div>
  );
}
