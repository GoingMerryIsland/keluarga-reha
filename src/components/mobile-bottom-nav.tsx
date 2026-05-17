'use client';

import { useState, useEffect } from 'react';
import { useBudgetStore } from '@/lib/budget-store';
import { useThemeStore } from '@/lib/theme-store';
import { useInstallPrompt } from '@/hooks/use-install-prompt';
import type { PageName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  ArrowRightLeft,
  CreditCard,
  MoreHorizontal,
  TrendingUp,
  ShoppingCart,
  Receipt,
  Landmark,
  ChartNoAxesCombined,
  X,
  Settings,
  Sun,
  Moon,
  Download,
  Trash2,
  Share,
  CheckCircle2,
  Wallet,
  Plus,
  Banknote,
  PiggyBank,
} from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  page: PageName;
}

// Left 2 + Right 2 around center FAB
const LEFT_NAV: NavItem[] = [
  { icon: <LayoutDashboard className="h-[22px] w-[22px]" />, label: 'Home', page: 'dashboard' },
  { icon: <ArrowRightLeft className="h-[22px] w-[22px]" />, label: 'Transaksi', page: 'transactions' },
];

const RIGHT_NAV: NavItem[] = [
  { icon: <ShoppingCart className="h-[22px] w-[22px]" />, label: 'Pengeluaran', page: 'expenses' },
  { icon: <MoreHorizontal className="h-[22px] w-[22px]" />, label: 'Lainnya', page: 'more' as PageName },
];

// More panel items
const MORE_NAV: NavItem[] = [
  { icon: <Wallet className="h-5 w-5" />, label: 'Pendapatan', page: 'income' },
  { icon: <Receipt className="h-5 w-5" />, label: 'Tagihan', page: 'bills' },
  { icon: <CreditCard className="h-5 w-5" />, label: 'Cicilan', page: 'debt' },
  { icon: <TrendingUp className="h-5 w-5" />, label: 'Hutang Aktif', page: 'active-debts' },
  { icon: <Landmark className="h-5 w-5" />, label: 'Tabungan', page: 'savings' },
  { icon: <ChartNoAxesCombined className="h-5 w-5" />, label: 'Laporan', page: 'report' },
];

// Add sheet items — "Tambah ..." options
interface AddItem {
  icon: React.ReactNode;
  label: string;
  desc: string;
  page: PageName;
  color: string;
  bgColor: string;
}

const ADD_ITEMS: AddItem[] = [
  {
    icon: <ArrowRightLeft className="h-5 w-5" />,
    label: 'Transaksi',
    desc: 'Catat transaksi baru',
    page: 'transactions',
    color: 'text-foreground',
    bgColor: 'bg-muted/60',
  },
  {
    icon: <Wallet className="h-5 w-5" />,
    label: 'Pendapatan',
    desc: 'Tambah sumber pendapatan',
    page: 'income',
    color: 'text-forest',
    bgColor: 'bg-forest-pale',
  },
  {
    icon: <ShoppingCart className="h-5 w-5" />,
    label: 'Pengeluaran',
    desc: 'Catat pengeluaran baru',
    page: 'expenses',
    color: 'text-danger',
    bgColor: 'bg-danger-pale',
  },
  {
    icon: <Receipt className="h-5 w-5" />,
    label: 'Tagihan',
    desc: 'Tambah tagihan rutin',
    page: 'bills',
    color: 'text-ocean',
    bgColor: 'bg-ocean-pale',
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    label: 'Cicilan',
    desc: 'Tambah pembayaran cicilan',
    page: 'debt',
    color: 'text-amber',
    bgColor: 'bg-amber-pale',
  },
  {
    icon: <Banknote className="h-5 w-5" />,
    label: 'Hutang',
    desc: 'Catat hutang baru',
    page: 'active-debts',
    color: 'text-ocean',
    bgColor: 'bg-ocean-pale',
  },
  {
    icon: <PiggyBank className="h-5 w-5" />,
    label: 'Tabungan & Investasi',
    desc: 'Tambah dana tabungan',
    page: 'savings',
    color: 'text-gold',
    bgColor: 'bg-amber-pale',
  },
];

function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 transition-all active:scale-90',
        isActive ? 'text-forest' : 'text-muted-foreground'
      )}
    >
      {isActive && (
        <div className="absolute -top-1.5 h-[3px] w-5 rounded-full bg-forest" />
      )}
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200',
          isActive && 'bg-forest-pale scale-110'
        )}
      >
        {item.icon}
      </div>
      <span
        className={cn(
          'text-[0.6rem] leading-tight transition-all',
          isActive ? 'font-bold' : 'font-medium'
        )}
      >
        {item.label}
      </span>
    </button>
  );
}

/* ─── Custom Bottom Sheet ─── */
function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      <div
        className={cn(
          'absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          visible ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out',
          visible ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="rounded-t-3xl bg-card shadow-2xl pb-[env(safe-area-inset-bottom)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function MobileBottomNav() {
  const { activePage, setPage, setPageWithAdd } = useBudgetStore();
  const { theme, toggleTheme } = useThemeStore();
  const { canInstall, isIOS, isInstalled, install } = useInstallPrompt();
  const [moreOpen, setMoreOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const isDark = theme === 'dark';
  const isMoreActive = MORE_NAV.some((item) => item.page === activePage);

  // Lock body scroll when any overlay is open
  const anyOverlayOpen = moreOpen || addOpen || settingsOpen;
  useEffect(() => {
    if (anyOverlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [anyOverlayOpen]);

  const handleNav = (page: PageName) => {
    setPage(page);
    setMoreOpen(false);
    setAddOpen(false);
  };

  const handleAdd = (page: PageName) => {
    setAddOpen(false);
    setPageWithAdd(page);
  };

  const openSettings = () => {
    setMoreOpen(false);
    setSettingsOpen(true);
  };

  return (
    <>
      {/* "More" overlay panel */}
      {moreOpen && (
        <div className="fixed inset-0 z-[90] md:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px] transition-opacity" />
          <div
            className="absolute bottom-[80px] left-3 right-3 z-[91] animate-in slide-in-from-bottom-4 fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Menu Lainnya
                </span>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted active:scale-90"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mx-4 h-px bg-border/50" />
              <div className="grid grid-cols-3 gap-1.5 p-3">
                {MORE_NAV.map((item) => {
                  const active = activePage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => handleNav(item.page)}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-2xl px-2 py-3.5 transition-all active:scale-95',
                        active ? 'bg-forest-pale' : 'hover:bg-muted/40'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-2xl transition-all',
                          active
                            ? 'bg-forest text-white shadow-md shadow-forest/25'
                            : 'bg-muted/60 text-muted-foreground'
                        )}
                      >
                        {item.icon}
                      </div>
                      <span
                        className={cn(
                          'text-[0.65rem] leading-tight',
                          active ? 'font-bold text-forest' : 'font-medium text-muted-foreground'
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}

                {/* Settings */}
                <button
                  onClick={openSettings}
                  className="flex flex-col items-center gap-2 rounded-2xl px-2 py-3.5 transition-all active:scale-95 hover:bg-muted/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground transition-all">
                    <Settings className="h-5 w-5" />
                  </div>
                  <span className="text-[0.65rem] font-medium leading-tight text-muted-foreground">
                    Pengaturan
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Bottom Sheet ─── */}
      <BottomSheet open={addOpen} onClose={() => setAddOpen(false)}>
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Plus className="h-4 w-4 text-forest" />
              Tambah Baru
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Pilih jenis yang ingin ditambahkan
            </p>
          </div>
          <button
            onClick={() => setAddOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted active:scale-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-px bg-border/50 mx-4" />

        <div className="space-y-1.5 px-4 py-3 pb-5">
          {ADD_ITEMS.map((item) => (
            <button
              key={item.page + item.label}
              onClick={() => handleAdd(item.page)}
              className="flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 transition-all active:scale-[0.98] hover:bg-muted/40"
            >
              <div className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                item.bgColor, item.color
              )}>
                {item.icon}
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold text-foreground">
                  {item.label}
                </span>
                <p className="text-[0.65rem] text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* ─── Settings Bottom Sheet ─── */}
      <BottomSheet open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Settings className="h-4 w-4 text-muted-foreground" />
              Pengaturan
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Kelola tampilan dan data aplikasi
            </p>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-colors hover:bg-muted active:scale-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-px bg-border/50 mx-4" />

        <div className="space-y-2 px-4 py-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3.5 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-pale text-gold">
                {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold text-foreground">
                  {isDark ? 'Mode Gelap' : 'Mode Terang'}
                </span>
                <p className="text-[0.65rem] text-muted-foreground">
                  {isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
                </p>
              </div>
            </div>
            <div
              className={cn(
                'relative h-7 w-12 rounded-full transition-colors duration-300',
                isDark ? 'bg-forest' : 'bg-border'
              )}
            >
              <div
                className={cn(
                  'absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300',
                  isDark ? 'translate-x-5' : 'translate-x-0.5'
                )}
              >
                {isDark ? (
                  <Moon className="h-3 w-3 text-forest" />
                ) : (
                  <Sun className="h-3 w-3 text-gold" />
                )}
              </div>
            </div>
          </button>

          {/* PWA Install */}
          {canInstall && (
            <button
              onClick={async () => {
                const success = await install();
                if (success) {
                  toast.success('Aplikasi berhasil diinstal! 🎉');
                  setSettingsOpen(false);
                }
              }}
              className="flex w-full items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground px-4 py-3.5 text-background transition-all active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/15">
                <Download className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold">📲 Download Aplikasi</span>
                <p className="text-[0.65rem] text-white/70">Pasang di layar utama</p>
              </div>
            </button>
          )}

          {/* iOS Install Guide */}
          {isIOS && (
            <>
              <button
                onClick={() => setShowIOSGuide(!showIOSGuide)}
                className="flex w-full items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground px-4 py-3.5 text-background transition-all active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/15">
                  <Download className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold">📲 Download Aplikasi</span>
                  <p className="text-[0.65rem] text-white/70">Pasang di layar utama</p>
                </div>
              </button>
              {showIOSGuide && (
                <div className="rounded-2xl border border-forest/20 bg-forest-pale p-4 text-xs text-forest space-y-2">
                  <p className="font-semibold">Cara install di iPhone/iPad:</p>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <p>Ketuk tombol <Share className="inline h-3.5 w-3.5" /> <strong>Share</strong> di bawah Safari</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <p>Pilih <strong>&quot;Add to Home Screen&quot;</strong></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <p>Ketuk <strong>&quot;Add&quot;</strong> untuk install</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Installed */}
          {isInstalled && (
            <div className="flex w-full items-center gap-3 rounded-2xl border border-forest/20 bg-forest-pale px-4 py-3.5 text-forest">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/15">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold">✅ Aplikasi Terinstal</span>
            </div>
          )}

          <div className="mx-1 h-px bg-border/50" />

          {/* Reset Data */}
          <button
            onClick={() => {
              setSettingsOpen(false);
              setTimeout(() => setConfirmResetOpen(true), 350);
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-danger/20 bg-danger-pale px-4 py-3.5 text-danger transition-all active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold">Kosongkan Data</span>
              <p className="text-[0.65rem] opacity-70">Hapus semua transaksi & anggaran</p>
            </div>
          </button>
        </div>
      </BottomSheet>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        open={confirmResetOpen}
        onOpenChange={setConfirmResetOpen}
        title="Kosongkan Semua Data"
        description="Apakah Anda yakin ingin mengosongkan semua data dan anggaran? Tindakan ini tidak dapat dibatalkan."
        onConfirm={() => {
          useBudgetStore.getState().resetData();
        }}
      />

      {/* ─── Bottom Navigation Bar ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-[80] md:hidden">
        <div className="border-t border-border/60 bg-card/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
          <div className="relative flex h-[72px] items-end justify-around px-1">
            {/* Left nav items (Home only) */}
            {LEFT_NAV.map((item) => (
              <NavButton
                key={item.page}
                item={item}
                isActive={activePage === item.page}
                onClick={() => handleNav(item.page)}
              />
            ))}

            {/* Center FAB spacer */}
            <div className="w-[72px] shrink-0" />

            {/* Right nav items (Transaksi + Lainnya) */}
            <NavButton
              item={RIGHT_NAV[0]}
              isActive={activePage === RIGHT_NAV[0].page}
              onClick={() => handleNav(RIGHT_NAV[0].page)}
            />
            {/* "More" button */}
            <NavButton
              item={RIGHT_NAV[1]}
              isActive={isMoreActive || moreOpen}
              onClick={() => setMoreOpen(!moreOpen)}
            />

            {/* Center FAB — "+" Add button */}
            <div className="absolute left-1/2 -top-[22px] -translate-x-1/2">
              <div className="rounded-full bg-gradient-to-b from-card to-card/80 p-[5px] shadow-xl shadow-black/10">
                <button
                  onClick={() => {
                    setMoreOpen(false);
                    setAddOpen(true);
                  }}
                  className={cn(
                    'flex h-[56px] w-[56px] items-center justify-center rounded-full transition-all duration-200 active:scale-90',
                    addOpen
                      ? 'bg-forest text-white shadow-lg shadow-forest/40 ring-2 ring-forest/20 rotate-45'
                      : 'bg-forest text-white shadow-lg shadow-forest/30 hover:shadow-forest/50'
                  )}
                >
                  <Plus className="h-7 w-7 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
