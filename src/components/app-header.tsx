'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useBudgetStore } from '@/lib/budget-store';
import { MONTHS, YEARS } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const currentMonth = useBudgetStore((s) => s.currentMonth);
  const currentYear = useBudgetStore((s) => s.currentYear);
  const switchMonth = useBudgetStore((s) => s.switchMonth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  const now = new Date();
  const realMonth = now.getMonth();
  const realYear = now.getFullYear();

  // Lock body scroll when dropdown is open
  useEffect(() => {
    if (dropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [dropdownOpen]);

  const monthItems = useMemo(() => {
    const items: { m: number; y: number; label: string }[] = [];
    YEARS.forEach((y) => {
      MONTHS.forEach((name, m) => {
        items.push({ m, y, label: `${name} ${y}` });
      });
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return items.filter(
        (it) =>
          it.label.toLowerCase().includes(q) || String(it.y).includes(q)
      );
    }

    return items.sort((a, b) => {
      const aIsCurrent = a.y === realYear ? 0 : 1;
      const bIsCurrent = b.y === realYear ? 0 : 1;
      if (aIsCurrent !== bIsCurrent) return aIsCurrent - bIsCurrent;
      if (a.y !== b.y) return a.y - b.y;
      return a.m - b.m;
    });
  }, [searchQuery, realYear]);

  useEffect(() => {
    if (dropdownOpen && activeItemRef.current && scrollRef.current) {
      requestAnimationFrame(() => {
        activeItemRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
      });
    }
  }, [dropdownOpen]);

  const handleSelectMonth = (m: number, y: number) => {
    switchMonth(m, y);
    setDropdownOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 w-full items-center justify-between bg-white dark:bg-card px-4 text-foreground border-b shadow-sm md:h-16 md:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm md:h-9 md:w-9 md:text-base">
          🌿
        </div>
        <div>
          <h1 className="text-base font-bold tracking-wide md:text-lg">
            Reha Budget
          </h1>
          <span className="hidden text-xs font-medium text-muted-foreground sm:block">
            Perencanaan Anggaran
          </span>
        </div>
      </div>

      {/* Mobile: month picker dropdown */}
      <div className="relative md:hidden">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 rounded-xl bg-forest-pale px-3 py-1.5 text-xs font-semibold text-forest transition-all active:scale-95"
        >
          <span>📅</span>
          <span>{MONTHS[currentMonth]} {currentYear}</span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform duration-200',
              dropdownOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => { setDropdownOpen(false); setSearchQuery(''); }}
            />
            <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in slide-in-from-top-2 fade-in duration-150">
              {/* Search */}
              <div className="border-b border-border p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari bulan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 text-sm h-8"
                    autoFocus
                  />
                </div>
              </div>
              {/* List */}
              <div ref={scrollRef} className="max-h-[220px] overflow-y-auto py-1">
                {monthItems.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    Bulan tidak ditemukan
                  </div>
                ) : (
                  monthItems.map((it) => {
                    const isActive = it.m === currentMonth && it.y === currentYear;
                    const isToday = it.m === realMonth && it.y === realYear;
                    return (
                      <button
                        key={`${it.m}_${it.y}`}
                        ref={isActive ? activeItemRef : undefined}
                        className={cn(
                          'flex w-full items-center justify-between px-3.5 py-2 text-sm transition-colors',
                          isActive
                            ? 'bg-forest font-semibold text-white'
                            : isToday
                              ? 'bg-forest-pale/60 font-medium text-forest'
                              : 'hover:bg-forest-pale hover:text-forest'
                        )}
                        onClick={() => handleSelectMonth(it.m, it.y)}
                      >
                        <div className="flex items-center gap-2">
                          <span>{MONTHS[it.m]}</span>
                          {isActive && (
                            <span className="rounded bg-white/25 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase leading-none tracking-wide">
                              Aktif
                            </span>
                          )}
                          {isToday && !isActive && (
                            <span className="rounded bg-forest/15 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase leading-none tracking-wide text-forest">
                              Sekarang
                            </span>
                          )}
                        </div>
                        <span className={cn('text-xs', isActive ? 'opacity-85' : 'opacity-60')}>
                          {it.y}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
