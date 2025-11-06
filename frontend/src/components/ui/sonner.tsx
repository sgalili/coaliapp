import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      dir="rtl"
      closeButton
      duration={4000}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-background group-[.toaster]:to-muted/50 group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:backdrop-blur-md group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg",
          closeButton:
            "group-[.toast]:bg-background group-[.toast]:border group-[.toast]:border-border group-[.toast]:hover:bg-muted group-[.toast]:rounded-full",
          success:
            "group-[.toaster]:border-green-500/50 group-[.toaster]:bg-green-50/80 group-[.toaster]:text-green-900",
          error:
            "group-[.toaster]:border-red-500/50 group-[.toaster]:bg-red-50/80 group-[.toaster]:text-red-900",
          info:
            "group-[.toaster]:border-blue-500/50 group-[.toaster]:bg-blue-50/80 group-[.toaster]:text-blue-900",
          warning:
            "group-[.toaster]:border-yellow-500/50 group-[.toaster]:bg-yellow-50/80 group-[.toaster]:text-yellow-900",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
