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
import { RupiahInput } from '@/components/ui/rupiah-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

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
  const [amount, setAmount] = useState<number | string>('');
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
    const parsedAmount = typeof amount === 'number' ? amount : parseFloat(amount as string);
    if (!name.trim() || !parsedAmount || parsedAmount <= 0 || !months) {
      toast.error('Nama, total hutang (harus > 0), dan lama cicilan wajib diisi!');
      return;
    }

    const payload = {
      name: name.trim(),
      amount: parsedAmount || 0,
      months: parseInt(months, 10) || 1,
      category,
    };

    if (editDebt) {
      updateDebt(editDebt.id, payload);
      toast.success('Hutang berhasil diperbarui!');
    } else {
      addDebt(payload);
      toast.success('Hutang berhasil ditambahkan!');
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
          <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">
                Total Hutang
              </label>
              <RupiahInput
                value={amount}
                onValueChange={setAmount}
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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
