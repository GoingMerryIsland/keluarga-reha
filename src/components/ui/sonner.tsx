"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-muted-foreground text-sm",
          title: "text-sm font-semibold",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium rounded-md px-3 py-1",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: 
            "group-[.toaster]:border-green-200 dark:group-[.toaster]:border-green-900/30 [&_[data-title]]:text-green-600 dark:[&_[data-title]]:text-green-500 [&_[data-icon]]:text-green-600 dark:[&_[data-icon]]:text-green-500",
          error:
            "group-[.toaster]:border-red-200 dark:group-[.toaster]:border-red-900/30 [&_[data-title]]:text-red-600 dark:[&_[data-title]]:text-red-500 [&_[data-icon]]:text-red-600 dark:[&_[data-icon]]:text-red-500",
          warning:
            "group-[.toaster]:border-orange-200 dark:group-[.toaster]:border-orange-900/30 [&_[data-title]]:text-orange-500 dark:[&_[data-title]]:text-orange-400 [&_[data-icon]]:text-orange-500 dark:[&_[data-icon]]:text-orange-400",
          info:
            "group-[.toaster]:border-blue-200 dark:group-[.toaster]:border-blue-900/30 [&_[data-title]]:text-blue-600 dark:[&_[data-title]]:text-blue-500 [&_[data-icon]]:text-blue-600 dark:[&_[data-icon]]:text-blue-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
