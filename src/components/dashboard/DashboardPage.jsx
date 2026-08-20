"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { PostJobDialog } from "@/components/dashboard/post-job-dialog";
import { Sidebar } from "./Sidebar";
import { ClientDashboard } from "./ClientDashboard";
import { DesignerDashboard } from "./DesignerDashboard";
import { DashboardHeader } from "./DashboardHeader";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from your API
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push("/login?next=/dashboard");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/login?next=/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cdeb00]"></div>
          <p className="mt-4 text-[#6b6b6b]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (user.verificationStatus !== "APPROVED") {
    router.push("/verify?next=/dashboard");
    return null;
  }

  if (user.role === "ADMIN") {
    router.push("/admin");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      <div className="fixed inset-y-0 left-0 z-30">
        <Sidebar user={user} activeTab="overview" />
      </div>

      <div className="flex-1 ml-[280px]">
        <div className="fixed top-0 right-0 left-[280px] z-20">
          <DashboardHeader user={user} />
        </div>

        <main className="mt-[78px] p-6">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h1 className="mt-1 font-display text-3xl font-semibold text-[#101010] tracking-tight">
                  Hello, {user.name.split(" ")[0]}
                </h1>
                <p className="text-sm text-[#6b6b6b]">
                  {user.role === "CLIENT" 
                    ? "Manage your projects and find the right talent." 
                    : "Discover opportunities and grow your career."}
                </p>
              </div>
              {user.role === "CLIENT" && <PostJobDialog />}
            </div>

            {user.role === "CLIENT" ? (
              <ClientDashboard userId={user.id} />
            ) : (
              <DesignerDashboard userId={user.id} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}