import React from "react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(0 0% 100%)",
          "--normal-border": "hsl(214.3 31.8% 91.4%)",
          "--normal-text": "hsl(222.2 84% 4.9%)",
          "--success-bg": "hsl(143 85% 96%)",
          "--success-border": "hsl(145 92% 91%)",
          "--success-text": "hsl(140 100% 27%)",
          "--error-bg": "hsl(0 93% 94%)",
          "--error-border": "hsl(0 93% 89%)",
          "--error-text": "hsl(0 84% 60%)",
          "--warning-bg": "hsl(48 100% 96%)",
          "--warning-border": "hsl(48 96% 89%)",
          "--warning-text": "hsl(31 92% 45%)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
