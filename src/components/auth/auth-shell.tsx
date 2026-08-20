import Link from "next/link";
import { Logo } from "@/components/logo";
import { BadgeCheck, Sparkles, Users } from "lucide-react";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#cdeb00] p-12 text-[#101010] lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="relative">
          <Logo className="[&_span:last-child]:text-[#101010] [&_.text-primary]:text-[#101010]" />
        </div>
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight">
            The trusted home for creative &amp; digital work.
          </h2>
          <p className="mt-4 text-[#101010]">
            Verified clients. Verified designers. Real projects, delivered
            without the phone-tag.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { icon: BadgeCheck, text: "Verified on both sides" },
              { icon: Sparkles, text: "Post a job in minutes" },
              { icon: Users, text: "A growing community of creatives" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-white/15">
                  <item.icon className="size-4" />
                </span>
                <span className="text-[#101010]">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-white/60">
          © {new Date().getFullYear()} Aleph Jobs
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
