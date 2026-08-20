import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#101010] py-28 text-white">
      {/* Background Accent Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[500px] -translate-x-1/2 rounded-full bg-[#cdeb00]/15 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-5 text-center">
        <h2 className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
          Ready to scale your team or <br />
          <span className="text-[#cdeb00]">land your next project?</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-zinc-400">
          Join <strong className="text-white font-medium">alephjobs</strong> today. 
          Connect with verified employers and top-tier talent in minutes.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-14 bg-[#cdeb00] px-8 text-base font-semibold text-[#101010] transition-transform duration-200 hover:bg-[#cdeb00]/90 hover:scale-105"
          >
            <Link href="/signup?role=CLIENT">Post a job</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 border-2 border-zinc-700 bg-transparent px-8 text-base font-semibold text-white transition-all duration-200 hover:border-[#cdeb00] hover:bg-[#cdeb00]/10 hover:text-[#cdeb00]"
          >
            <Link href="/signup?role=TALENT">Join as a talent</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}