import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface RupiahInputProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value: number | string;
  onValueChange: (value: number | string) => void;
}

export function RupiahInput({
  className,
  value,
  onValueChange,
  ...props
}: RupiahInputProps) {
  // Format numeric value to local string (e.g. 1000000 -> "1.000.000")
  const formatRupiah = (val: number | string) => {
    if (val === "" || val === null || val === undefined) return "";
    const num = typeof val === "string" ? parseInt(val.replace(/\D/g, ""), 10) : val;
    if (isNaN(num)) return "";
    return num.toLocaleString("id-ID");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hanya ambil angka
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      onValueChange("");
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      onValueChange(parsed);
    }
  };

  return (
    <div className="relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
        Rp
      </span>
      <Input
        type="text"
        className={cn("pl-9", className)}
        value={formatRupiah(value)}
        onChange={handleChange}
        inputMode="numeric"
        {...props}
      />
    </div>
  );
}
