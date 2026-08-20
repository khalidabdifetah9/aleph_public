"use client";

import React from "react";
import DashboardStats from "@/components/admin/graph";

// Automatically extracts prop types directly from DashboardStats component
export type AdminStatsProps = React.ComponentProps<typeof DashboardStats>;

export function AdminStats({
  pendingUsers = [],
  pendingJobs = [],
  liveJobs = 0,
  approvedCount = 0,
  pendingPayments = [],
  recentPaid = [],
  failedPayments = [],
  ...rest
}: AdminStatsProps) {
  return (
    <DashboardStats
      pendingUsers={pendingUsers}
      pendingJobs={pendingJobs}
      liveJobs={liveJobs}
      approvedCount={approvedCount}
      pendingPayments={pendingPayments}
      recentPaid={recentPaid}
      failedPayments={failedPayments}
      {...rest}
    />
  );
}