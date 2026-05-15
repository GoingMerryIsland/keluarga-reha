'use client';

import { useBudgetStore, fmt } from '@/lib/budget-store';
import { RupiahInput } from '@/components/ui/rupiah-input';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

function BudgetInput({ initialBudget, onSave }: { initialBudget: number; onSave: (val: number) => void }) {
  const [val, setVal] = useState<number | string>(initialBudget);
  
  useEffect(() => {
    setVal(initialBudget);
  }, [initialBudget]);

  return (
    <RupiahInput
      value={val}
      onValueChange={setVal}
      onBlur={() => {
        const parsed = typeof val === 'string' ? parseInt(val.replace(/\D/g, ''), 10) : val;
        onSave(isNaN(parsed) ? 0 : parsed);
      }}
      placeholder="0"
      className="w-full sm:w-40 bg-cream text-right font-semibold focus:bg-card pl-9"
    />
  );
}

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
            className="border-b border-border py-4 last:border-b-0"
          >
            {/* Category name */}
            <div className="mb-2 text-sm font-semibold text-foreground">{cat}</div>

            {/* Progress bar */}
            <div className="mb-2 flex items-center gap-2.5">
              <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-border">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', barCls)}
                  style={{ width: `${p}%` }}
                />
              </div>
              <span className={cn('text-xs font-semibold shrink-0', pctColor)}>
                {p}%
              </span>
            </div>

            {/* Amount + Budget row */}
            <div className="flex items-center justify-between gap-4 mt-1">
              <div className="flex flex-col gap-1.5">
                <span className="whitespace-nowrap text-sm font-bold text-foreground">
                  {fmt(actual)}
                </span>
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  dari {fmt(budget)}
                </span>
              </div>
              <div className="w-full max-w-[140px] sm:max-w-[160px]">
                <BudgetInput
                  initialBudget={budget}
                  onSave={(val) => updateBudget(type, cat, val)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
