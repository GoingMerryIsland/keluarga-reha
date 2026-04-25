'use client';

import { useState } from 'react';
import { useBudgetStore } from '@/lib/budget-store';
import { ALL_CATS } from '@/lib/constants';
import type { TransactionType } from '@/lib/types';
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

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: TransactionType;
}

export function AddTransactionDialog({
  open,
  onOpenChange,
  defaultType = 'Pengeluaran',
}: AddTransactionDialogProps) {
  const addTransaction = useBudgetStore((s) => s.addTransaction);

  const [type, setType] = useState<TransactionType>(defaultType);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [name, setName] = useState('');
  const [cat, setCat] = useState(ALL_CATS[defaultType][0]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const cats = ALL_CATS[type] || [];

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const newCats = ALL_CATS[newType];
    setCat(newCats[0]);
  };

  const handleSave = () => {
    if (!name.trim() || !amount) {
      alert('Nama dan jumlah wajib diisi!');
      return;
    }

    addTransaction({
      date,
      type,
      name: name.trim(),
      cat,
      amount: parseFloat(amount) || 0,
      note: note.trim(),
    });

    // Reset
    setName('');
    setAmount('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    onOpenChange(false);
  };

  // Reset type when dialog opens with a different defaultType
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setType(defaultType);
      setCat(ALL_CATS[defaultType][0]);
      setDate(new Date().toISOString().split('T')[0]);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold tracking-tight">
            Tambah Transaksi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Tanggal
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Tipe
              </label>
              <Select value={type} onValueChange={(v) => handleTypeChange(v as TransactionType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                  <SelectItem value="Pendapatan">Pendapatan</SelectItem>
                  <SelectItem value="Tagihan">Tagihan</SelectItem>
                  <SelectItem value="Utang">Utang / Cicilan</SelectItem>
                  <SelectItem value="Tabungan">Tabungan / Investasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Nama Transaksi
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Belanja groceries"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Kategori
              </label>
              <Select value={cat} onValueChange={(v) => v && setCat(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cats.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Jumlah (Rp)
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
                Keterangan (opsional)
              </label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Catatan tambahan"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSave} className="bg-forest hover:bg-forest-light">
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
