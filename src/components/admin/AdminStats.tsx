"use client";

import DashboardStats from "@/components/admin/graph";

interface AdminStatsProps {
  pendingUsers: any[];
  pendingJobs: any[];
  liveJobs: number;
  approvedCount: number;
  pendingPayments: any[];
  recentPaid: any[];
  failedPayments: any[];
}

export function AdminStats({
  pendingUsers,
  pendingJobs,
  liveJobs,
  approvedCount,
  pendingPayments,
  recentPaid,
  failedPayments,
}: AdminStatsProps) {
  const statsData = {
    pendingUsers: pendingUsers || [],
    pendingJobs: pendingJobs || [],
    liveJobs: liveJobs || 0,
    approvedCount: approvedCount || 0,
    pendingPayments: pendingPayments || [],
    recentPaid: recentPaid || [],
    failedPayments: failedPayments || []
  };

  return <DashboardStats {...statsData} />;
}