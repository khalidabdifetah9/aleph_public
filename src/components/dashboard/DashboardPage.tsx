import { redirect } from "next/navigation";
import { PostJobDialog } from "@/components/dashboard/post-job-dialog";
import { requireApprovedUser } from "@/lib/session";
import { Sidebar } from "./Sidebar";
import { ClientDashboard } from "./ClientDashboard";
import { DesignerDashboard } from "./DesignerDashboard";
import { DashboardHeader } from "./DashboardHeader";

export async function DashboardPage() {
  const user = await requireApprovedUser();
  if (user.role === "ADMIN") redirect("/admin");

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