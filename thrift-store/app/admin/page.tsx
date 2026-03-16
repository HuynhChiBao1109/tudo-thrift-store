'use client';

import { useDashboard } from '@/hooks/useApi';
import { formatPrice, formatDate, getStatusColor } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, ShoppingCart, Users, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function StatCard({
  title, value, change, icon: Icon, loading
}: {
  title: string;
  value: string;
  change?: number;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              {change !== undefined && (
                <p className={cn('text-xs mt-1 flex items-center gap-1 font-medium', change >= 0 ? 'text-emerald-600' : 'text-red-500')}>
                  <ArrowUpRight size={12} className={change < 0 ? 'rotate-180' : ''} />
                  {Math.abs(change)}% this month
                </p>
              )}
            </div>
            <div className="w-10 h-10 bg-[#06365b]/10 rounded-xl flex items-center justify-center">
              <Icon size={18} className="text-[#06365b]" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useDashboard();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={isLoading ? '-' : formatPrice(stats?.totalRevenue || 0)}
          change={stats?.revenueChange}
          icon={TrendingUp}
          loading={isLoading}
        />
        <StatCard
          title="Total Orders"
          value={isLoading ? '-' : String(stats?.totalOrders || 0)}
          change={stats?.ordersChange}
          icon={ShoppingCart}
          loading={isLoading}
        />
        <StatCard
          title="Products Listed"
          value={isLoading ? '-' : String(stats?.totalProducts || 0)}
          icon={Package}
          loading={isLoading}
        />
        <StatCard
          title="Customers"
          value={isLoading ? '-' : String(stats?.totalCustomers || 0)}
          icon={Users}
          loading={isLoading}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats?.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#06365b"
                    strokeWidth={2}
                    dot={{ fill: '#06365b', strokeWidth: 0, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-14" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.topProducts.map(({ product, sold }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#06365b]">{formatPrice(product.price)}</p>
                      <p className="text-xs text-gray-400">{sold} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-12" />)}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                    <th className="pb-3 font-medium">Order</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 font-mono text-xs text-[#06365b] font-medium">{order.id}</td>
                      <td className="py-3 text-gray-700">{order.customer.name}</td>
                      <td className="py-3 text-gray-400">{formatDate(order.createdAt)}</td>
                      <td className="py-3">
                        <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium capitalize', getStatusColor(order.status))}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-semibold">{formatPrice(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
