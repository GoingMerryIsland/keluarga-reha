'use client';

import { useBudgetStore, fmt, pct } from '@/lib/budget-store';
import { MONTHS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function DashboardPage() {
  const { currentMonth, currentYear, getSummary, getMonthData } = useBudgetStore();
  const summary = getSummary();
  const monthData = getMonthData();

  // Donut chart data
  const segments = [
    { label: 'Pengeluaran', val: summary.actualExpense, color: '#C0392B' },
    { label: 'Tagihan', val: summary.actualBill, color: '#1A5276' },
    { label: 'Cicilan', val: summary.actualDebt, color: '#B7950B' },
    { label: 'Tabungan', val: summary.actualSaving, color: '#C8973A' },
  ].filter((s) => s.val > 0);

  const total = segments.reduce((s, x) => s + x.val, 0) || 1;

  // Donut SVG paths
  const r = 45, cx = 60, cy = 60;
  let startAngle = -Math.PI / 2;
  const paths = segments.map((seg) => {
    const angle = (seg.val / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(startAngle + angle);
    const y2 = cy + r * Math.sin(startAngle + angle);
    const large = angle > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    startAngle += angle;
    return <path key={seg.label} d={d} fill={seg.color} opacity="0.85" />;
  });

  // Cashflow items
  const cashflowItems = [
    { label: 'Pendapatan', actual: summary.actualIncome, budget: summary.budgetIncome, color: '#2D5A3D' },
    { label: 'Pengeluaran', actual: summary.actualExpense, budget: summary.budgetExpense, color: '#C0392B' },
    { label: 'Tagihan', actual: summary.actualBill, budget: summary.budgetBill, color: '#1A5276' },
    { label: 'Cicilan', actual: summary.actualDebt, budget: summary.budgetDebt, color: '#B7950B' },
    { label: 'Tabungan', actual: summary.actualSaving, budget: summary.budgetSaving, color: '#C8973A' },
  ];

  // Top expense categories
  const expByCat: Record<string, number> = {};
  monthData.transactions
    .filter((t) => t.type === 'Pengeluaran')
    .forEach((t) => {
      expByCat[t.cat] = (expByCat[t.cat] || 0) + t.amount;
    });
  const sorted = Object.entries(expByCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxVal = sorted[0]?.[1] || 1;

  return (
    <div className="space-y-6">
      {/* Period Banner */}
      <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-br from-forest to-forest-light p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-white opacity-80">
            Anggaran Keluarga Reha • Periode Aktif
          </p>
        </div>
        <div className="sm:text-right">
          <div className="text-xs font-medium text-white opacity-80">Sisa Saldo</div>
          <div className="text-3xl font-bold tracking-tight text-white">
            {fmt(summary.sisa)}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: '💵', label: 'Total Pendapatan', amount: summary.actualIncome,
            sub: `Dianggarkan: ${fmt(summary.budgetIncome)}`, accent: 'border-l-forest', textColor: 'text-forest',
          },
          {
            icon: '💸', label: 'Total Pengeluaran', amount: summary.actualExpense,
            sub: `Dianggarkan: ${fmt(summary.budgetExpense)}`, accent: 'border-l-danger', textColor: 'text-danger',
          },
          {
            icon: '🏦', label: 'Tabungan', amount: summary.actualSaving,
            sub: `Target: ${fmt(summary.budgetSaving)}`, accent: 'border-l-gold', textColor: 'text-gold',
          },
          {
            icon: '💳', label: 'Cicilan / Utang', amount: summary.actualDebt,
            sub: `Cicilan: ${fmt(summary.budgetDebt)}`, accent: 'border-l-ocean', textColor: 'text-ocean',
          },
        ].map((card) => (
          <Card key={card.label} className={cn('border-l-4', card.accent)}>
            <CardContent className="p-5">
              <div className="mb-2 text-2xl">{card.icon}</div>
              <div className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {card.label}
              </div>
              <div className={cn('text-2xl font-bold tracking-tight', card.textColor)}>
                {fmt(card.amount)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {card.sub}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Donut Chart */}
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 text-lg font-semibold tracking-tight">
              🥧 Komposisi Pengeluaran
            </h3>
            {segments.length > 0 ? (
              <div className="flex items-center gap-8">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  className="shrink-0"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="22"
                  />
                  {paths}
                </svg>
                <div className="flex-1 space-y-2">
                  {segments.map((seg) => (
                    <div
                      key={seg.label}
                      className="flex items-center gap-2 text-sm leading-relaxed"
                    >
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span>
                        {seg.label}:{' '}
                        <strong>{pct(seg.val, total)}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <div className="mb-2 text-4xl">📊</div>
                <p className="text-sm text-muted-foreground">Belum ada data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cashflow Summary */}
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 text-lg font-semibold tracking-tight">
              📉 Ringkasan Arus Kas
            </h3>
            <div className="space-y-3">
              {cashflowItems.map((it) => {
                const p = it.budget
                  ? Math.min(100, Math.round((it.actual / it.budget) * 100))
                  : 0;
                return (
                  <div key={it.label}>
                    <div className="mb-1 flex justify-between text-sm leading-relaxed">
                      <span>{it.label}</span>
                      <span style={{ color: it.color }}>
                        {fmt(it.actual)} / {fmt(it.budget)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${p}%`,
                          backgroundColor: it.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight">
              🏆 Top Kategori Pengeluaran
            </h3>
            <span className="rounded-full bg-forest-pale px-2.5 py-0.5 text-xs font-medium text-forest">
              Bulan Ini
            </span>
          </div>

          {sorted.length > 0 ? (
            <div className="space-y-0">
              {sorted.map(([cat, amt]) => (
                <div
                  key={cat}
                  className="flex items-center justify-between border-b border-border py-3 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="mb-1 text-sm font-semibold text-foreground">{cat}</div>
                    <div className="flex items-center gap-2">
                      <div className="h-[5px] w-[40%] overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-forest transition-all duration-500"
                          style={{
                            width: `${Math.round((amt / maxVal) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {Math.round((amt / maxVal) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm font-bold text-foreground">
                    {fmt(amt)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <div className="mb-2 text-4xl">🛒</div>
              <p className="text-sm text-muted-foreground">Belum ada pengeluaran</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
