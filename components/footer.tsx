import Link from "next/link"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-border relative overflow-hidden">
      {/* Background with Smooth Transition from Call-to-Action Section */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
      
      {/* Top Transition Layer - Smooth Blend from Call-to-Action */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background via-background/90 to-transparent"></div>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-between gap-4 pt-10 pb-4 md:h-24 md:flex-row md:pt-0 md:pb-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-6 w-6" />
              <span className="font-bold">ArenaX</span>
            </Link>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                ArenaX Team
              </a>
              . The source code is available on{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <nav className="flex items-center space-x-4 text-sm">
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Cookies
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 pt-6 pb-2 md:flex-row md:pt-4 md:pb-1">
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
              <p className="text-sm text-muted-foreground">Email: support@arenax.com</p>
            </div>
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} ArenaX. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
