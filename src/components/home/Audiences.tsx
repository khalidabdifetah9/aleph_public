import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CLIENT_FEATURES, DESIGNER_FEATURES } from "@/utils/home/constants";

export function Audiences() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 overflow-hidden">
      <div className="grid gap-12 lg:grid-cols-2">
        <div
          id="clients"
          className="-skew-y-3 transform rounded-3xl bg-[#cdeb00] p-10 text-[#101010] shadow-xl transition-transform duration-300 hover:skew-y-0"
        >
          <div className="skew-y-3 transform">
            <h3 className="font-display text-3xl font-bold tracking-tight">
              For clients
            </h3>
            <p className="mt-3 text-base font-medium opacity-90 leading-relaxed">
              Need a logo, poster, or any digital work? Post it once and let
              verified designers come to you.
            </p>

            <ul className="mt-8 space-y-3">
              {CLIENT_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#101010]" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="mt-8 bg-[#101010] text-white hover:bg-[#101010]/90 border-none font-semibold px-6 py-6 rounded-xl"
            >
              <Link href="/signup?role=CLIENT">Post your first job</Link>
            </Button>
          </div>
        </div>

        {/* Designers Card - Slanted Up-Right */}
        <div
          id="designers"
          className="skew-y-3 transform rounded-3xl bg-[#cdeb00] p-10 text-[#101010] shadow-xl transition-transform duration-300 hover:skew-y-0"
        >
          {/* Counter-skew inner container to keep text upright */}
          <div className="-skew-y-3 transform">
            <h3 className="font-display text-3xl font-bold tracking-tight">
              For designers
            </h3>
            <p className="mt-3 text-base font-medium opacity-90 leading-relaxed">
              Build your profile, get verified, and win real work from clients
              who are ready to hire.
            </p>

            <ul className="mt-8 space-y-3">
              {DESIGNER_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full bg-[#101010]" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              asChild
              variant="outline"
              className="mt-8 border-2 border-[#101010] bg-transparent text-[#101010] hover:bg-[#101010] hover:text-[#cdeb00] font-semibold px-6 py-6 rounded-xl"
            >
              <Link href="/signup?role=DESIGNER">Create your profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}