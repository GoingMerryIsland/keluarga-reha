'use client';

import { useBudgetStore, fmt } from '@/lib/budget-store';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CategoryListProps {
  cats: string[];
  type: string;
  budgetMap: Record<string, number>;
  actualMap: Record<string, number>;
}

export function CategoryList({ cats, type, budgetMap, actualMap }: CategoryListProps) {
  const updateBudget = useBudgetStore((s) => s.updateBudget);

  return (
    <div className="flex flex-col">
      {cats.map((cat) => {
        const actual = actualMap[cat] || 0;
        const budget = budgetMap[cat] || 0;
        const p = budget
          ? Math.min(100, Math.round((actual / budget) * 100))
          : actual > 0
            ? 100
            : 0;
        const barCls =
          p >= 100 ? 'bg-danger' : p >= 80 ? 'bg-gold' : 'bg-forest';
        const pctColor =
          p >= 100
            ? 'text-danger'
            : p >= 80
              ? 'text-gold'
              : 'text-forest';

        return (
          <div
            key={cat}
            className="grid grid-cols-1 gap-2 border-b border-border py-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:gap-6"
          >
            {/* Left side */}
            <div className="flex flex-col gap-1.5">
              <div className="text-sm font-semibold text-foreground">{cat}</div>
              <div className="flex items-center gap-2.5">
                <div className="h-[5px] w-[30%] overflow-hidden rounded-full bg-border">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', barCls)}
                    style={{ width: `${p}%` }}
                  />
                </div>
                <span className={cn('text-xs font-semibold', pctColor)}>
                  {p}%
                </span>
              </div>
              <div className="flex gap-3">
                <span className="text-sm font-bold text-foreground">{fmt(actual)}</span>
                <span className="text-xs text-muted-foreground">
                  dari {fmt(budget)}
                </span>
              </div>
            </div>

            {/* Right side - budget input */}
            <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:justify-center sm:gap-1">
              <span className="text-[0.72rem] font-medium uppercase tracking-widest text-muted-foreground">
                Anggaran (Rp)
              </span>
              <Input
                type="number"
                defaultValue={budget}
                placeholder="0"
                className="w-full sm:w-40 bg-cream text-right font-semibold focus:bg-card"
                onBlur={(e) =>
                  updateBudget(type, cat, parseFloat(e.target.value) || 0)
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
