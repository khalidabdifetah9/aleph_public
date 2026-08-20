import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#101010] text-zinc-400">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              Connecting world-class talent with innovative employers. Built for modern hiring and seamless collaboration.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#how" className="transition-colors hover:text-[#cdeb00]">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/signup?role=CLIENT" className="transition-colors hover:text-[#cdeb00]">
                  For Employers
                </Link>
              </li>
              <li>
                <Link href="/signup?role=TALENT" className="transition-colors hover:text-[#cdeb00]">
                  For Talent
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Get Started
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="transition-colors hover:text-[#cdeb00]">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/signup" className="transition-colors hover:text-[#cdeb00]">
                  Sign up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/60 pt-8 text-xs text-zinc-500 md:flex-row">
          <p>© {new Date().getFullYear()} alephjobs. Crafted for modern hiring.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-zinc-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-zinc-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}