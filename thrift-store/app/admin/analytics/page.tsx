"use client";

import { useDashboard } from "@/hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#003966", "#1f5577", "#4a7695", "#7e9eb5", "#b4c7d4"];

export default function AdminAnalyticsPage() {
  const { data: stats, isLoading } = useDashboard();

  const categoryData = [
    { name: "Tops", value: 28 },
    { name: "Bottoms", value: 22 },
    { name: "Dresses", value: 18 },
    { name: "Outerwear", value: 15 },
    { name: "Other", value: 17 },
  ];

  const conditionData = [
    { condition: "Like New", count: 8 },
    { condition: "Good", count: 12 },
    { condition: "Fair", count: 5 },
    { condition: "Worn", count: 3 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Analytics
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Store performance overview
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-52" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats?.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#003966" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category split */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-52" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}%`}
                    labelLine={false}
                  >
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Condition distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Items by Condition</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-52" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={conditionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    dataKey="condition"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={60}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3387c7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Summary cards */}
        {isLoading ? null : (
          <>
            <div className="bg-gradient-to-br from-[#003966] to-[#1f5577] rounded-xl p-6 text-white">
              <p className="text-blue-200 text-sm font-medium">
                Avg. Order Value
              </p>
              <p className="text-3xl font-bold mt-1">
                {formatPrice(
                  (stats?.totalRevenue || 0) / (stats?.totalOrders || 1),
                )}
              </p>
              <p className="text-blue-200 text-xs mt-2">
                Based on all completed orders
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <p className="text-gray-500 text-sm font-medium">
                Conversion Rate
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">3.2%</p>
              <p className="text-emerald-500 text-xs font-medium mt-2">
                ↑ +0.4% from last month
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
