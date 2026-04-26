"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-hidden bg-card text-card-foreground shadow-sm ring-1 ring-foreground/10 p-4 rounded-[2rem]"
    >
      <div className="w-full overflow-x-auto pb-2">
        <table
          data-slot="table"
          className={cn("w-full caption-bottom text-sm border-separate border-spacing-0", className)}
          {...props}
        />
      </div>
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b-0", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 font-medium",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "group transition-colors data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-12 px-5 text-left align-middle text-sm font-medium text-muted-foreground whitespace-nowrap",
        "relative",
        // Vertical separators on the left side of columns (except the first one)
        "[&:not(:first-child)]:before:content-[''] [&:not(:first-child)]:before:absolute [&:not(:first-child)]:before:left-0 [&:not(:first-child)]:before:top-[30%] [&:not(:first-child)]:before:h-[40%] [&:not(:first-child)]:before:w-[1px] [&:not(:first-child)]:before:bg-border/60",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-4 px-5 align-middle whitespace-nowrap",
        "bg-white dark:bg-slate-950 group-hover:bg-slate-50 dark:group-hover:bg-slate-900/80 transition-colors",
        "border-b border-slate-100 dark:border-slate-800/60 group-last:border-b-0",
        // Round the corners of the white background for the first and last rows
        "group-first:first:rounded-tl-2xl group-first:last:rounded-tr-2xl",
        "group-last:first:rounded-bl-2xl group-last:last:rounded-br-2xl",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
