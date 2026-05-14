'use client';

import { useState, useMemo } from 'react';
import { useBudgetStore, fmt } from '@/lib/budget-store';
import { useThemeStore } from '@/lib/theme-store';
import { MONTHS, YEARS, SIDEBAR_ITEMS } from '@/lib/constants';
import type { PageName } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, Search, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export function AppSidebar() {
  const {
    currentMonth,
    currentYear,
    activePage,
    sidebarOpen,
    setPage,
    switchMonth,
    getSummary,
    closeSidebar,
  } = useBudgetStore();

  const { theme, toggleTheme } = useThemeStore();

  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const summary = getSummary();

  const monthItems = useMemo(() => {
    const items: { m: number; y: number; label: string }[] = [];
    YEARS.forEach((y) => {
      MONTHS.forEach((name, m) => {
        items.push({ m, y, label: `${name} ${y}` });
      });
    });
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(q) || String(it.y).includes(q)
    );
  }, [searchQuery]);

  const handleSelectMonth = (m: number, y: number) => {
    switchMonth(m, y);
    setMonthDropdownOpen(false);
    setSearchQuery('');
  };

  const isDark = theme === 'dark';

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/35 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed bottom-0 left-0 top-16 z-40 flex w-[260px] flex-col overflow-y-auto border-r border-border bg-card shadow-xl transition-transform duration-300 md:translate-x-0 md:shadow-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Month Picker */}
        <div className="relative mx-4 mt-4 mb-2">
          <button
            className="flex w-full items-center gap-2 rounded-xl border-[1.5px] border-forest-pale bg-forest-pale px-3 py-2.5 text-left transition-all hover:border-forest"
            onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
          >
            <span className="text-base">📅</span>
            <span className="flex-1 text-sm font-semibold text-forest">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-forest transition-transform',
                monthDropdownOpen && 'rotate-180'
              )}
            />
          </button>

          {monthDropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border-[1.5px] border-border bg-card shadow-xl">
              <div className="border-b border-border p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari bulan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 text-sm"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-[220px] overflow-y-auto py-1">
                {monthItems.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    Bulan tidak ditemukan
                  </div>
                ) : (
                  monthItems.map((it) => {
                    const isActive =
                      it.m === currentMonth && it.y === currentYear;
                    return (
                      <button
                        key={`${it.m}_${it.y}`}
                        className={cn(
                          'flex w-full items-center justify-between px-4 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-forest font-semibold text-white'
                            : 'hover:bg-forest-pale hover:text-forest'
                        )}
                        onClick={() => handleSelectMonth(it.m, it.y)}
                      >
                        <span>{MONTHS[it.m]}</span>
                        <span
                          className={cn(
                            'text-xs',
                            isActive ? 'opacity-85' : 'opacity-60'
                          )}
                        >
                          {it.y}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary Card */}
        <div className="mx-4 mb-4 rounded-xl bg-forest p-4 text-white">
          <div className="mb-1 text-[0.7rem] font-medium opacity-75">Sisa Saldo</div>
          <div className="text-lg font-bold">{fmt(summary.sisa)}</div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(0, Math.min(100, summary.actualIncome ? Math.round((summary.sisa / summary.actualIncome) * 100) : 0))}%`,
                backgroundColor: summary.sisa >= 0 ? 'var(--gold-custom)' : 'var(--danger)',
              }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[0.7rem] font-medium opacity-80">
            <span>Pemasukan: {fmt(summary.actualIncome)}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-6 flex-1">
          <div className="mb-2 px-5 text-[0.65rem] font-medium uppercase tracking-widest text-muted-foreground">
            Menu Utama
          </div>
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.page}
              className={cn(
                'flex w-full items-center gap-3 px-5 py-2.5 text-sm text-muted-foreground transition-all hover:bg-forest-pale hover:text-forest',
                activePage === item.page &&
                  'border-r-[3px] border-forest bg-forest-pale font-semibold text-forest'
              )}
              onClick={() => setPage(item.page as PageName)}
            >
              <span className="w-5 text-center text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Reset Data & Theme Toggle at Bottom */}
        <div className="mt-auto px-4 pb-4">
          <Separator className="mb-4" />
          <button
            onClick={() => setConfirmResetOpen(true)}
            className="mb-3 flex w-full items-center justify-between rounded-xl border border-danger/20 bg-danger-pale px-4 py-3 text-danger transition-all hover:bg-danger/20"
          >
            <span className="text-sm font-semibold">⚠️ Kosongkan Data</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3 transition-all hover:bg-muted"
            aria-label="Toggle dark mode"
          >
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon className="h-4 w-4 text-gold" />
              ) : (
                <Sun className="h-4 w-4 text-gold" />
              )}
              <span className="text-sm font-medium text-foreground">
                {isDark ? 'Mode Gelap' : 'Mode Terang'}
              </span>
            </div>

            {/* Toggle Switch */}
            <div
              className={cn(
                'relative h-6 w-11 rounded-full transition-colors duration-300',
                isDark ? 'bg-forest' : 'bg-border'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center',
                  isDark ? 'translate-x-5' : 'translate-x-0.5'
                )}
              >
                {isDark ? (
                  <Moon className="h-3 w-3 text-forest" />
                ) : (
                  <Sun className="h-3 w-3 text-gold" />
                )}
              </div>
            </div>
          </button>
        </div>

        <ConfirmDialog
          open={confirmResetOpen}
          onOpenChange={setConfirmResetOpen}
          title="Kosongkan Semua Data"
          description="Apakah Anda yakin ingin mengosongkan semua data dan anggaran? Tindakan ini tidak dapat dibatalkan."
          onConfirm={() => {
            useBudgetStore.getState().resetData();
          }}
        />
      </aside>
    </>
  );
}
