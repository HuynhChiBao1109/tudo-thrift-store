"use client";

import { useOrders, useUpdateOrderStatus } from "@/hooks/useApi";
import { Order, OrderStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice, formatDate, getStatusColor, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Package } from "lucide-react";

const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: "wait_confirm", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" },
];

const statusLabelMap = Object.fromEntries(statusOptions.map((status) => [status.value, status.label])) as Record<
  OrderStatus,
  string
>;

const paymentLabelMap: Record<Order["paymentMethod"], string> = {
  cod: "COD",
  qr: "QR",
};

export default function AdminOrdersPage() {
  const { data, isLoading } = useOrders();
  const orders = data?.data || [];
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus.mutateAsync({ id: orderId, status });
      toast.success("Cập nhật trạng thái đơn hàng thành công");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể cập nhật trạng thái đơn hàng");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Orders
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">{data?.total || 0} đơn hàng</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {statusOptions.map((status) => {
          const count = orders.filter((o) => o.status === status.value).length;
          return (
            <div key={status.value} className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <p
                className={cn(
                  "text-xs mt-1 font-medium capitalize px-2 py-0.5 rounded-full inline-block",
                  getStatusColor(status.value),
                )}
              >
                {status.label}
              </p>
            </div>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p>No orders yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100">
                <tr className="text-left text-xs text-gray-400 uppercase">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Payment</th>
                  <th className="px-6 py-3 font-medium">Items</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-[#003966] font-medium">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.fullName || order.customer.name}</p>
                        <p className="text-xs text-gray-400">
                          {order.phone || order.customer.email || "Guest checkout"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{paymentLabelMap[order.paymentMethod]}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleStatusChange(order.id, v as OrderStatus)}
                      >
                        <SelectTrigger
                          className={cn("w-32 h-7 text-xs border-0 rounded-full px-3", getStatusColor(order.status))}
                        >
                          <SelectValue>{statusLabelMap[order.status]}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => (
                            <SelectItem key={s.value} value={s.value} className="text-xs">
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
