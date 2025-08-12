import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { ComparisonProvider } from "@/contexts/comparison-context"
import { ComparisonBar } from "@/components/comparison-bar"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Tools & Automation Hub",
  description:
    "Comprehensive platform for AI development tools, system prompts, and n8n automation workflows. Explore prompts from v0, Cursor, Devin, and discover powerful automation workflows.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ComparisonProvider>
            {children}
            <ComparisonBar />
          </ComparisonProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
