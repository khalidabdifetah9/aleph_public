import Link from "next/link";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-[#101010] text-white">
      <div className=" flex h-16 px-35 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/#how" className="transition-colors hover:text-[#cdeb00]">
            How it works
          </Link>
          <Link
            href="/#designers"
            className="transition-colors hover:text-[#cdeb00]"
          >
            For designers
          </Link>
          <Link
            href="/#clients"
            className="transition-colors hover:text-[#cdeb00]"
          >
            For clients
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <UserMenu
              name={user.name}
              email={user.email}
              role={user.role}
              image={user.image}
            />
          ) : (
            <div className="flex items-center space-x-5">
                <Link className="text-white" href="/signup">Get started</Link>
                <Link className="px-8 rounded-sm py-2 bg-[#cdeb00] text-black" href="/login">Log in</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
