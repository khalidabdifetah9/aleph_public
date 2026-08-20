"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BriefcaseBusiness, 
  MessageSquare, 
  WalletCards, 
  Star, 
  Settings2, 
  LifeBuoy, 
  LogOut,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  activeTab?: string;
  className?: string;
}

export function Sidebar({ user, activeTab = "overview", className = "" }: SidebarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isClient = user.role === "CLIENT";

  const navigation = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      id: "projects",
      label: isClient ? "My Projects" : "Find Work",
      icon: BriefcaseBusiness,
      href: isClient ? "/dashboard/projects" : "/dashboard/find-work",
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      href: "/dashboard/messages",
    },
    {
      id: "payments",
      label: "Payments",
      icon: WalletCards,
      href: "/dashboard/payments",
    },
  ];

  const manageNav = [
    {
      id: "saved",
      label: isClient ? "Saved Talent" : "Saved Jobs",
      icon: Star,
      href: isClient ? "/dashboard/saved-talent" : "/dashboard/saved-jobs",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings2,
      href: "/dashboard/settings",
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authClient.signOut({
      onSuccess: () => {
        toast.success("Logged out successfully");
        router.push("/login");
        router.refresh();
      },
      onError: () => {
        toast.error("Failed to log out");
        setIsLoggingOut(false);
      },
    });
  };

  const NavItem = ({ 
    item, 
    isActive 
  }: { 
    item: typeof navigation[0]; 
    isActive: boolean;
  }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-[9px] border-0 bg-transparent px-3 py-2.5 text-left text-[13px] transition-all duration-200",
        isActive
          ? "bg-white/10 text-white shadow-[inset_3px_0_#cdeb00]"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      )}
    >
      <item.icon size={17} />
      <span className="flex-1">{item.label}</span>
    </Link>
  );

  return (
    <aside
      className={cn(
        "flex h-screen w-[280px] flex-col bg-[#101010] px-4 pb-6 pt-7 text-white",
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}
    >
      <div className="flex items-center gap-2.5 px-3">
        <span className="text-[17px] font-bold tracking-[-0.04em]">Aleph Jobs</span>
      </div>

      <div className="mx-1 mb-7 mt-9 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-[11px]">
        <div className="grid size-[38px] flex-none place-items-center rounded-[9px] bg-[#cdeb00] text-sm font-extrabold text-[#101010]">
          {initials}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[11px] text-gray-400">Workspace</span>
          <strong className="truncate text-xs font-semibold text-white">{user.name}</strong>
          <span className="text-[10px] text-gray-500 capitalize">{user.role.toLowerCase()}</span>
        </div>
        <ChevronDown size={15} className="text-gray-400" />
      </div>

      <nav className="flex flex-col gap-1" aria-label="Primary navigation">
        <span className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.07em] text-gray-500">
          Workspace
        </span>
        {navigation.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
          />
        ))}
      </nav>

      <nav className="mt-6 flex flex-col gap-1" aria-label="Manage navigation">
        <span className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.07em] text-gray-500">
          Manage
        </span>
        {manageNav.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
          />
        ))}
      </nav>

      <div className="mt-auto">
        <Link
          href="/help"
          className="mx-[3px] mb-[22px] flex items-center gap-[9px] rounded-[11px] bg-white/5 p-3 transition-colors hover:bg-white/10"
        >
          <div className="grid size-7 place-items-center rounded-lg bg-[#cdeb00] text-[#101010]">
            <LifeBuoy size={16} />
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <strong className="text-[11px]">Need a hand?</strong>
            <span className="text-[10px] text-gray-400">Visit Help Center</span>
          </div>
          <ArrowUpRight size={15} className="text-gray-400" />
        </Link>

        <div className="flex items-center gap-[9px] border-t border-white/10 px-2 pt-[13px]">
          <div className="grid size-[34px] flex-none place-items-center rounded-[9px] bg-[#cdeb00] text-xs font-extrabold text-[#101010]">
            {initials}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <strong className="truncate text-xs font-medium text-white">{user.name}</strong>
            <span className="text-[11px] text-gray-400 truncate">{user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-red-400 disabled:opacity-50"
            aria-label="Logout"
          >
            <LogOut size={17} />
          </button>
        </div>

        <p className="mt-3 text-center text-[9px] text-gray-600">
          Aleph Jobs v2.0
        </p>
      </div>
    </aside>
  );
}