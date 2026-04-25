'use client';

import { useState, useEffect } from 'react';
import { useBudgetStore } from '@/lib/budget-store';
import { DEBT_CATS } from '@/lib/constants';
import type { Debt } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DebtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editDebt?: Debt | null;
}

export function DebtDialog({
  open,
  onOpenChange,
  editDebt,
}: DebtDialogProps) {
  const addDebt = useBudgetStore((s) => s.addDebt);
  const updateDebt = useBudgetStore((s) => s.updateDebt);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('');
  const [category, setCategory] = useState(DEBT_CATS[0]);

  useEffect(() => {
    if (open) {
      if (editDebt) {
        setName(editDebt.name);
        setAmount(editDebt.amount.toString());
        setMonths(editDebt.months.toString());
        setCategory(editDebt.category || DEBT_CATS[0]);
      } else {
        setName('');
        setAmount('');
        setMonths('');
        setCategory(DEBT_CATS[0]);
      }
    }
  }, [open, editDebt]);

  const handleSave = () => {
    if (!name.trim() || !amount || !months) {
      alert('Nama, total hutang, dan lama cicilan wajib diisi!');
      return;
    }

    const payload = {
      name: name.trim(),
      amount: parseFloat(amount) || 0,
      months: parseInt(months, 10) || 1,
      category,
    };

    if (editDebt) {
      updateDebt(editDebt.id, payload);
    } else {
      addDebt(payload);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            {editDebt ? 'Edit Hutang' : 'Tambah Hutang'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Nama / Keperluan Hutang
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: KPR Rumah, Pinjaman Koperasi"
            />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Total Hutang (Rp)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Lama Cicilan (Bulan)
              </label>
              <Input
                type="number"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">
              Kategori
            </label>
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEBT_CATS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSave} className="bg-ocean hover:bg-ocean-light">
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
