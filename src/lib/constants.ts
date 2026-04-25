import type { TransactionType } from './types';

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const YEARS = [2024, 2025, 2026, 2027];

export const INCOME_CATS = [
  'Gaji Suami',
  'Gaji Istri',
  'Usaha Sampingan',
  'Pendapatan Lain',
];

export const EXPENSE_CATS = [
  'Makanan', 'Transportasi', 'Kesehatan', 'Rumah Tangga',
  'Pakaian', 'Kecantikan', 'Pendidikan', 'Hadiah',
  'Pengembangan Diri', 'Hiburan', 'Lainnya',
];

export const BILL_CATS = [
  'Internet', 'Listrik', 'Air', 'Ponsel',
  'Asuransi Jiwa', 'Asuransi Kesehatan', 'Sampah', 'Gas', 'Tagihan Lain',
];

export const DEBT_CATS = [
  'Pinjaman Sekolah', 'Cicilan Rumah', 'Cicilan Kendaraan', 'Pinjaman Lain',
];

export const SAVING_CATS = [
  'Dana Perjalanan', 'Dana Pernikahan', 'Dana Kendaraan',
  'Saham', 'Dana Mutual', 'Mata Uang Kripto', 'Tabungan Darurat',
];

export const ALL_CATS: Record<TransactionType, string[]> = {
  Pendapatan: INCOME_CATS,
  Pengeluaran: EXPENSE_CATS,
  Tagihan: BILL_CATS,
  Utang: DEBT_CATS,
  Tabungan: SAVING_CATS,
};

export const SIDEBAR_ITEMS: { icon: string; label: string; page: string }[] = [
  { icon: '📊', label: 'Dashboard', page: 'dashboard' },
  { icon: '📝', label: 'Transaksi', page: 'transactions' },
  { icon: '💰', label: 'Pendapatan', page: 'income' },
  { icon: '🛒', label: 'Pengeluaran', page: 'expenses' },
  { icon: '📋', label: 'Tagihan', page: 'bills' },
  { icon: '💳', label: 'Pembayaran Utang', page: 'debt' },
  { icon: '🏦', label: 'Tabungan & Investasi', page: 'savings' },
  { icon: '📈', label: 'Laporan', page: 'report' },
];

export const DEFAULT_BUDGETS = {
  income: {
    'Gaji Suami': 8500000,
    'Gaji Istri': 3500000,
    'Usaha Sampingan': 0,
    'Pendapatan Lain': 0,
  },
  expense: {
    Makanan: 1500000,
    Transportasi: 500000,
    Kesehatan: 300000,
    'Rumah Tangga': 500000,
    Pakaian: 200000,
    Kecantikan: 150000,
    Pendidikan: 200000,
    Hadiah: 100000,
    'Pengembangan Diri': 100000,
    Hiburan: 200000,
    Lainnya: 200000,
  },
  bill: {
    Internet: 200000,
    Listrik: 300000,
    Air: 100000,
    Ponsel: 150000,
    'Asuransi Jiwa': 200000,
    'Asuransi Kesehatan': 300000,
    Sampah: 50000,
    Gas: 100000,
    'Tagihan Lain': 0,
  },
  debt: {
    'Pinjaman Sekolah': 500000,
    'Cicilan Rumah': 1500000,
    'Cicilan Kendaraan': 700000,
    'Pinjaman Lain': 0,
  },
  saving: {
    'Dana Perjalanan': 200000,
    'Dana Pernikahan': 0,
    'Dana Kendaraan': 100000,
    Saham: 300000,
    'Dana Mutual': 200000,
    'Mata Uang Kripto': 0,
    'Tabungan Darurat': 200000,
  },
};
