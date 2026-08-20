"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ClipboardList, ScrollText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Review queue", icon: ClipboardList, exact: true },
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
  { href: "/admin/logs", label: "Activity log", icon: ScrollText, exact: false },
] as const;

export function AdminToolbar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Button
            key={href}
            asChild
            size="sm"
            variant={active ? "default" : "outline"}
            className={cn("gap-1.5", active && "shadow-sm")}
          >
            <Link href={href}>
              <Icon className="size-3.5" />
              {label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
