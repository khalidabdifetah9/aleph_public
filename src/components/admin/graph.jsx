"use client";

import {
  UserCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Users,
  CreditCard,
  ReceiptText,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-700">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm" style={{ color: item.color }}>
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardStats = ({
  pendingUsers = [],
  pendingJobs = [],
  liveJobs = 0,
  approvedCount = 0,
  pendingPayments = [],
  recentPaid = [],
  failedPayments = []
}) => {
  // Ensure all values are arrays or numbers
  const safePendingUsers = Array.isArray(pendingUsers) ? pendingUsers : [];
  const safePendingJobs = Array.isArray(pendingJobs) ? pendingJobs : [];
  const safePendingPayments = Array.isArray(pendingPayments) ? pendingPayments : [];
  const safeRecentPaid = Array.isArray(recentPaid) ? recentPaid : [];
  const safeFailedPayments = Array.isArray(failedPayments) ? failedPayments : [];
  
  const safeLiveJobs = typeof liveJobs === 'number' ? liveJobs : 0;
  const safeApprovedCount = typeof approvedCount === 'number' ? approvedCount : 0;

  // Stats data preparation
  const statsData = {
    pendingUsers: safePendingUsers.length,
    pendingJobs: safePendingJobs.length,
    liveJobs: safeLiveJobs,
    verifiedMembers: safeApprovedCount,
    pendingPayments: safePendingPayments.length,
    recentPaid: safeRecentPaid.length,
    failedPayments: safeFailedPayments.length
  };

  // Main stats data for bar chart
  const mainStats = [
    { name: 'Awaiting Verification', value: statsData.pendingUsers, icon: '👤', color: '#f59e0b' },
    { name: 'Jobs to Review', value: statsData.pendingJobs, icon: '💼', color: '#f97316' },
    { name: 'Live Jobs', value: statsData.liveJobs, icon: '✅', color: '#22c55e' },
    { name: 'Verified Members', value: statsData.verifiedMembers, icon: '👥', color: '#6366f1' }
  ];

  // Payment stats data for pie chart
  const paymentStats = [
    { name: 'Payments Pending', value: statsData.pendingPayments, color: '#f97316' },
    { name: 'Recent Paid', value: statsData.recentPaid, color: '#22c55e' },
    { name: 'Payment Failures', value: statsData.failedPayments, color: '#f59e0b' }
  ];

  // Trend data (for demonstration - replace with actual historical data)
  const trendData = [
    { month: 'Jan', pendingUsers: 12, pendingJobs: 8, liveJobs: 45, verified: 180 },
    { month: 'Feb', pendingUsers: 15, pendingJobs: 6, liveJobs: 52, verified: 210 },
    { month: 'Mar', pendingUsers: 8, pendingJobs: 10, liveJobs: 48, verified: 230 },
    { month: 'Apr', pendingUsers: 10, pendingJobs: 7, liveJobs: 55, verified: 260 },
    { month: 'May', pendingUsers: 6, pendingJobs: 5, liveJobs: 62, verified: 290 },
    { month: 'Jun', pendingUsers: statsData.pendingUsers, pendingJobs: statsData.pendingJobs, liveJobs: statsData.liveJobs, verified: statsData.verifiedMembers }
  ];

  return (
    <div className="space-y-8">
      {/* Main Stats - Bar Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Overview Statistics</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Updated just now</span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mainStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {mainStats.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 flex-wrap">
          {mainStats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
              <span className="text-sm text-gray-600">{stat.name}: {stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Stats - Pie Chart & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Payment Distribution</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Total: {statsData.pendingPayments + statsData.recentPaid + statsData.failedPayments}</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {paymentStats.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Stats Cards */}
        <div className="grid grid-rows-3 gap-4">
          {paymentStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex items-center justify-between hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  {index === 0 && <CreditCard className="w-6 h-6" style={{ color: stat.color }} />}
                  {index === 1 && <ReceiptText className="w-6 h-6" style={{ color: stat.color }} />}
                  {index === 2 && <AlertTriangle className="w-6 h-6" style={{ color: stat.color }} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400">
                  {index === 0 && '⏳ Awaiting'}
                  {index === 1 && '✅ Completed'}
                  {index === 2 && '⚠️ Issues'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Analysis - Area Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Trend Analysis (6 Months)</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Pending Users
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              Jobs to Review
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Live Jobs
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              Verified Members
            </span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="pendingUsers" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Area type="monotone" dataKey="pendingJobs" stroke="#f97316" fill="#f97316" fillOpacity={0.2} />
              <Area type="monotone" dataKey="liveJobs" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
              <Area type="monotone" dataKey="verified" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <UserCheck className="w-8 h-8 text-amber-600" />
            <span className="text-2xl font-bold text-amber-700">{statsData.pendingUsers}</span>
          </div>
          <p className="text-sm text-amber-700 mt-1">Awaiting Verification</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <BriefcaseBusiness className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-700">{statsData.pendingJobs}</span>
          </div>
          <p className="text-sm text-orange-700 mt-1">Jobs to Review</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-700">{statsData.liveJobs}</span>
          </div>
          <p className="text-sm text-green-700 mt-1">Live Jobs</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
          <div className="flex items-center justify-between">
            <Users className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-700">{statsData.verifiedMembers}</span>
          </div>
          <p className="text-sm text-indigo-700 mt-1">Verified Members</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;