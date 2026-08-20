"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { JobList } from "./JobList";
import { UserList } from "./UserList";
import { PaymentList } from "./PaymentList";
import { LiveJobsList } from "./LiveJobsList";

export function AdminTabs({
  pendingJobs = [],
  pendingUsers = [],
  pendingPayments = [],
  failedPayments = [],
  recentPaid = [],
  liveJobs = 0,
}) {
  return (
    <Tabs defaultValue="jobs" className="space-y-6">
      <TabsList className="border-b border-[#e8e8e8] bg-transparent p-0 h-auto">
        <TabsTrigger
          value="jobs"
          className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-[#6b6b6b] data-[state=active]:border-[#cdeb00] data-[state=active]:bg-transparent data-[state=active]:text-[#101010] data-[state=active]:shadow-none"
        >
          Jobs ({(pendingJobs || []).length})
        </TabsTrigger>
        <TabsTrigger
          value="people"
          className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-[#6b6b6b] data-[state=active]:border-[#cdeb00] data-[state=active]:bg-transparent data-[state=active]:text-[#101010] data-[state=active]:shadow-none"
        >
          People ({(pendingUsers || []).length})
        </TabsTrigger>
        <TabsTrigger
          value="payments"
          className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-[#6b6b6b] data-[state=active]:border-[#cdeb00] data-[state=active]:bg-transparent data-[state=active]:text-[#101010] data-[state=active]:shadow-none"
        >
          Payments ({(pendingPayments || []).length + (failedPayments || []).length})
        </TabsTrigger>
        <TabsTrigger
          value="live"
          className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-[#6b6b6b] data-[state=active]:border-[#cdeb00] data-[state=active]:bg-transparent data-[state=active]:text-[#101010] data-[state=active]:shadow-none"
        >
          Live ({liveJobs})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="jobs">
        <JobList jobs={pendingJobs} />
      </TabsContent>

      <TabsContent value="people">
        <UserList users={pendingUsers} />
      </TabsContent>

      <TabsContent value="payments">
        <PaymentList
          pendingPayments={pendingPayments}
          failedPayments={failedPayments}
        />
      </TabsContent>

      <TabsContent value="live">
        <LiveJobsList jobs={recentPaid} />
      </TabsContent>
    </Tabs>
  );
}