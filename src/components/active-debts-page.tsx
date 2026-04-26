'use client';

import { useState, useEffect } from 'react';
import { useBudgetStore, fmt } from '@/lib/budget-store';
import type { Debt } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DebtDialog } from './debt-dialog';
import { ConfirmDialog } from './ui/confirm-dialog';

export function ActiveDebtsPage() {
  const { data, deleteDebt } = useBudgetStore();
  const [debtDialogOpen, setDebtDialogOpen] = useState(false);
  const [editDebt, setEditDebt] = useState<Debt | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const debts = data.debts || [];
  const totalPages = Math.ceil(debts.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedDebts = debts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">💸 Daftar Hutang Aktif</h2>
      </div>

      <div className="pt-2">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight">Semua Hutang</h3>
            <Button onClick={() => { setEditDebt(null); setDebtDialogOpen(true); }} className="bg-ocean hover:bg-ocean-light">
              + Tambah Hutang
            </Button>
          </div>
          {debts.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Nama / Keperluan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Total Hutang</TableHead>
                    <TableHead>Lama Cicilan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDebts.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="text-sm font-semibold text-foreground">{d.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{d.category}</TableCell>
                      <TableCell className="text-sm font-bold text-foreground">{fmt(d.amount)}</TableCell>
                      <TableCell className="text-sm text-foreground">{d.months} Bulan</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => { setEditDebt(d); setDebtDialogOpen(true); }}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => {
                            setDebtToDelete(d.id);
                            setConfirmOpen(true);
                          }}>
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Sebelumnya
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Selanjutnya
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-muted-foreground rounded-[2rem] border-2 border-dashed">
              <div className="mb-3 text-4xl">💸</div>
              <p className="text-sm">Belum ada daftar hutang yang dicatat.</p>
            </div>
          )}
        </div>
      </div>

      <DebtDialog open={debtDialogOpen} onOpenChange={setDebtDialogOpen} editDebt={editDebt} />
      
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Hapus Hutang"
        description="Apakah Anda yakin ingin menghapus catatan hutang ini? Tindakan ini tidak dapat dibatalkan."
        onConfirm={() => {
          if (debtToDelete) {
            deleteDebt(debtToDelete);
            setDebtToDelete(null);
          }
        }}
      />
    </div>
  );
}
