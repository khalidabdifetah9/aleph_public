import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  showText = true,
}: {
  className?: string;
  href?: string;
  showText?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-2.5", className)}
    >
      {/* <span className="grid size-9 place-items-center overflow-hidden rounded-xl bg-card shadow-sm transition-transform group-hover:-rotate-6">
        <Image
          src="/alephlogo.png"
          alt="Aleph Jobs logo"
          width={20}
          height={20}
          className="size-5 object-contain"
          priority
        />
      </span> */}
      {showText && (
        <span className="font-display text-lg font-semibold tracking-tight">
          Aleph<span className="text-[#cdeb00]">Jobs</span>
        </span>
      )}
    </Link>
  );
}
