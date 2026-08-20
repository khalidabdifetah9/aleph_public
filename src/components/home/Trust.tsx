import { Badge } from "@/components/ui/badge";
import { TrustPill } from "./TrustPill";
import { ShieldCheck, BadgeCheck, Star } from "lucide-react";

export function Trust() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-24 overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[350px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cdeb00]/10 blur-[120px]" />

      <div className="grid items-center gap-16 md:grid-cols-2">
        <div>

          <h3 className="font-display text-4xl font-bold tracking-tight text-[#101010] md:text-5xl">
            Trust is built in<br />
            <span className="text-[#cdeb00]">for everyone.</span>
          </h3>

          <p className="mt-6 text-lg leading-relaxed text-zinc-400">
            Both employers and talent complete their profile and undergo review by our 
            team before accessing the market. That means real people, verified jobs, 
            and zero surprises.
          </p>
        </div>

        <div className="relative flex justify-center">
          {/* Subtle Ambient Ring behind the mockup */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#cdeb00]/20 to-transparent blur-2xl" />

          <div className="w-full max-w-md space-y-4">
            {/* Main Highlight Card */}
            <div className="flex items-center justify-between border-l-4 border-[#cdeb00] bg-[#101010] p-6 text-white shadow-2xl transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-full bg-[#cdeb00] text-[#101010]">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg text-white">Admin Approved</p>
                    <BadgeCheck className="size-5 text-[#cdeb00]" />
                  </div>
                  <p className="text-xs uppercase tracking-wider text-zinc-400">
                    alephjobs Verified
                  </p>
                </div>
              </div>
            </div>

            {/* Skeleton Stats / Activity Preview */}
          </div>
        </div>
      </div>
    </section>
  );
}