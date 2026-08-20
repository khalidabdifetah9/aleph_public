import { AdminHeader } from "./AdminHeader";
import { AdminStats } from "./AdminStats";
import { AdminTabs } from "./AdminTabs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";

interface AdminPageProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  pendingUsers: any[];
  pendingJobs: any[];
  liveJobs: number;
  approvedCount: number;
  pendingPayments: any[];
  recentPaid: any[];
  failedPayments: any[];
}

export function AdminPage({
  user,
  pendingUsers,
  pendingJobs,
  liveJobs,
  approvedCount,
  pendingPayments,
  recentPaid,
  failedPayments,
}: AdminPageProps) {
  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      {/* Sidebar - fixed */}
      <div className="fixed inset-y-0 left-0 z-30">
        <Sidebar user={user} activeTab="overview" />
      </div>

      {/* Main Content - with left margin for sidebar */}
      <div className="flex-1 ml-[280px]">
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 left-[280px] z-20">
          <DashboardHeader user={user} />
        </div>

        {/* Page Content - with top padding for header */}
        <main className="mt-[78px] p-6">
          <div className="mx-auto w-full max-w-6xl">
            <AdminHeader />

            <div className="mb-8">
              <AdminStats
                pendingUsers={pendingUsers}
                pendingJobs={pendingJobs}
                liveJobs={liveJobs}
                approvedCount={approvedCount}
                pendingPayments={pendingPayments}
                recentPaid={recentPaid}
                failedPayments={failedPayments}
              />
            </div>

            <AdminTabs
              pendingJobs={pendingJobs}
              pendingUsers={pendingUsers}
              pendingPayments={pendingPayments}
              failedPayments={failedPayments}
              recentPaid={recentPaid}
              liveJobs={liveJobs}
            />
          </div>
        </main>
      </div>
    </div>
  );
}