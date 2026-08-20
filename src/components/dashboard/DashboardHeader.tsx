"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, ChevronDown, User, Settings, LogOut, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New application received", time: "5 min ago", read: false },
    { id: 2, title: "Payment confirmed", time: "1 hour ago", read: false },
    { id: 3, title: "Job posting approved", time: "3 hours ago", read: true },
  ]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex h-[78px] items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-sm px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-[#101010]">Dashboard</p>
          <p className="text-xs text-[#6b6b6b]">{currentDate}</p>
        </div>
        <div className="sm:hidden">
          <p className="text-sm font-medium text-[#101010]">{currentDate}</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 w-80 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-[#cdeb00] focus-within:bg-white transition-all">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search projects, people, or jobs..."
          className="w-full border-0 bg-transparent text-sm text-[#101010] outline-none placeholder:text-gray-400"
        />
        <kbd className="hidden sm:inline-block rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 text-sm text-[#6b6b6b]">
          <span className="font-medium text-[#101010]">{currentTime}</span>
          <span className="text-gray-300">|</span>
          <span>{currentDate}</span>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl hover:bg-gray-100"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#cdeb00] text-[10px] font-bold text-[#101010]">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <button className="text-xs text-[#cdeb00] hover:underline">
                Mark all as read
              </button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center justify-between w-full">
                  <span className={cn(
                    "text-sm font-medium",
                    !notif.read ? "text-[#101010]" : "text-gray-500"
                  )}>
                    {notif.title}
                  </span>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-[#cdeb00]" />
                  )}
                </div>
                <span className="text-xs text-gray-400">{notif.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-[#cdeb00] hover:underline">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-xl px-2 hover:bg-gray-100"
            >
              <Avatar className="h-9 w-9 border-2 border-[#cdeb00]/20">
                <AvatarFallback className="bg-[#cdeb00] text-[#101010] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[#101010] leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-[#6b6b6b] capitalize leading-tight">
                  {user.role.toLowerCase()}
                </p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium text-[#101010]">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User size={16} className="mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings size={16} className="mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <HelpCircle size={16} className="mr-2" /> Help Center
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700">
              <LogOut size={16} className="mr-2" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}