import type { TransactionType } from './types';

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const currentYear = new Date().getFullYear();
export const YEARS = Array.from({ length: currentYear - 2024 + 11 }, (_, i) => 2024 + i);

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
  { icon: '💳', label: 'Pembayaran Cicilan', page: 'debt' },
  { icon: '💸', label: 'Daftar Hutang Aktif', page: 'active-debts' },
  { icon: '🏦', label: 'Tabungan & Investasi', page: 'savings' },
  { icon: '📈', label: 'Laporan', page: 'report' },
];

export const DEFAULT_BUDGETS = {
  income: {
    'Gaji Suami': 0,
    'Gaji Istri': 0,
    'Usaha Sampingan': 0,
    'Pendapatan Lain': 0,
  },
  expense: {
    Makanan: 0,
    Transportasi: 0,
    Kesehatan: 0,
    'Rumah Tangga': 0,
    Pakaian: 0,
    Kecantikan: 0,
    Pendidikan: 0,
    Hadiah: 0,
    'Pengembangan Diri': 0,
    Hiburan: 0,
    Lainnya: 0,
  },
  bill: {
    Internet: 0,
    Listrik: 0,
    Air: 0,
    Ponsel: 0,
    'Asuransi Jiwa': 0,
    'Asuransi Kesehatan': 0,
    Sampah: 0,
    Gas: 0,
    'Tagihan Lain': 0,
  },
  debt: {
    'Pinjaman Sekolah': 0,
    'Cicilan Rumah': 0,
    'Cicilan Kendaraan': 0,
    'Pinjaman Lain': 0,
  },
  saving: {
    'Dana Perjalanan': 0,
    'Dana Pernikahan': 0,
    'Dana Kendaraan': 0,
    Saham: 0,
    'Dana Mutual': 0,
    'Mata Uang Kripto': 0,
    'Tabungan Darurat': 0,
  },
};
