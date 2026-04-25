'use client';

import { useBudgetStore } from '@/lib/budget-store';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  const toggleSidebar = useBudgetStore((s) => s.toggleSidebar);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 w-full items-center justify-between bg-white dark:bg-card px-4 text-foreground border-b shadow-sm md:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-base">
          🌿
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide">
            Keluarga Reha
          </h1>
          <span className="hidden text-xs font-medium text-muted-foreground sm:block">
            Perencanaan Anggaran
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
