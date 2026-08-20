import { AdminHeader } from "./AdminHeader";
import { AdminStats } from "./AdminStats";
import { AdminTabs } from "./AdminTabs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";

export function AdminPage({
  user,
  pendingUsers = [],
  pendingJobs = [],
  liveJobs = 0,
  approvedCount = 0,
  pendingPayments = [],
  recentPaid = [],
  failedPayments = [],
}) {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Sidebar */}
      <Sidebar user={user} activeTab="overview" />

      {/* Main Layout Container */}
      <div className="flex flex-col lg:pl-70">
        {/* Fixed Header */}
        <header className="fixed top-0 right-0 left-0 z-20 border-b border-gray-200 bg-white lg:left-70">
          <DashboardHeader user={user} />
        </header>

        {/* Dashboard Main Content */}
        <main className="mt-19.5 flex-1 p-4 md:p-6">
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