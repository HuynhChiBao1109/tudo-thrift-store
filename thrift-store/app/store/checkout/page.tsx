"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Banknote, CheckCircle2, CreditCard, MapPin, QrCode, RefreshCw, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { authApi, checkoutApi } from "@/lib/api";
import { formatPrice, resolveImageUrl, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckoutOrder } from "@/types";

type Province = {
  code: number;
  name: string;
};

type District = {
  code: number;
  name: string;
};

type PaymentMethod = "cod" | "qr";

const SHIPPING_FEE = 30000;
const VIETQR_BANK_BIN = "970422";
const VIETQR_ACCOUNT_NO = "123456789";
const VIETQR_ACCOUNT_NAME = "Tudo4Noreason";
const CHECKOUT_ORDER_STORAGE_KEY = "checkout_order_id";

const ORDER_STATUS_LABELS: Record<CheckoutOrder["status"], string> = {
  wait_confirm: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const ORDER_STATUS_STYLES: Record<CheckoutOrder["status"], string> = {
  wait_confirm: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  shipping: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

function buildOrderCode(orderId: string) {
  const numeric = orderId.replace(/\D/g, "") || orderId;
  return `TUDO-${numeric.padStart(6, "0").slice(-6)}`;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [note, setNote] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<CheckoutOrder | null>(null);
  const [refreshingOrder, setRefreshingOrder] = useState(false);
  const [confirmingQr, setConfirmingQr] = useState(false);

  const grandTotal = total + (items.length > 0 ? SHIPPING_FEE : 0);
  const orderCode = useMemo(() => `TUDO-${Date.now().toString().slice(-8)}`, []);
  const activeTotal = createdOrder?.total ?? grandTotal;
  const activeOrderCode = createdOrder ? buildOrderCode(createdOrder.id) : orderCode;

  const qrImageUrl = useMemo(() => {
    const params = new URLSearchParams({
      amount: String(activeTotal),
      addInfo: activeOrderCode,
      accountName: VIETQR_ACCOUNT_NAME,
    });

    return `https://img.vietqr.io/image/${VIETQR_BANK_BIN}-${VIETQR_ACCOUNT_NO}-compact2.png?${params.toString()}`;
  }, [activeOrderCode, activeTotal]);

  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = (await response.json()) as Province[];
        setProvinces(data);
      } catch {
        toast.error("Failed to load Vietnam provinces");
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  useEffect(() => {
    const restoreLatestOrder = async () => {
      if (typeof window === "undefined") return;
      const orderId = localStorage.getItem(CHECKOUT_ORDER_STORAGE_KEY);
      if (!orderId) return;

      try {
        const order = await checkoutApi.getOrderById(orderId);
        setCreatedOrder(order);
      } catch {
        localStorage.removeItem(CHECKOUT_ORDER_STORAGE_KEY);
      }
    };

    restoreLatestOrder();
  }, []);

  useEffect(() => {
    const hydrateUser = async () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      try {
        setIsLoggedIn(true);
        const profile = await authApi.me();
        if (profile.fullName) setFullName(profile.fullName);
        if (profile.phone) setPhone(profile.phone);
        if (profile.address) setStreetAddress(profile.address);
      } catch {
        setIsLoggedIn(false);
      }
    };

    hydrateUser();
  }, []);

  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict("");
      return;
    }

    const loadDistricts = async () => {
      setLoadingDistricts(true);
      setSelectedDistrict("");
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`);
        const data = (await response.json()) as { districts?: District[] };
        setDistricts(data.districts || []);
      } catch {
        toast.error("Failed to load districts");
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };

    loadDistricts();
  }, [selectedProvince]);

  const validateForm = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }
    if (!fullName.trim()) {
      toast.error("Please enter full name");
      return false;
    }
    if (!streetAddress.trim()) {
      toast.error("Please enter address");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Please enter phone number");
      return false;
    }
    if (!selectedProvince) {
      toast.error("Please select province / city");
      return false;
    }
    if (!selectedDistrict) {
      toast.error("Please select district");
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (!validateForm()) return;
    setShowPayment(true);
    toast.success("Address verified. Choose payment method.");
  };

  const handleRefreshOrder = async () => {
    if (!createdOrder) return;

    setRefreshingOrder(true);
    try {
      const latestOrder = await checkoutApi.getOrderById(createdOrder.id);
      setCreatedOrder(latestOrder);
      toast.success(`Đơn hàng hiện tại: ${ORDER_STATUS_LABELS[latestOrder.status]}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tải lại trạng thái đơn hàng");
    } finally {
      setRefreshingOrder(false);
    }
  };

  const handleConfirmQrPayment = async () => {
    if (!createdOrder) return;

    setConfirmingQr(true);
    try {
      const updatedOrder = await checkoutApi.confirmQrPayment(createdOrder.id);
      setCreatedOrder(updatedOrder);
      toast.success("Thanh toán QR đã được xác nhận. Đơn hàng chuyển sang đang giao.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Chưa thể xác nhận thanh toán QR");
    } finally {
      setConfirmingQr(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setPlacingOrder(true);
    try {
      const provinceName = provinces.find((province) => String(province.code) === selectedProvince)?.name || "";
      const districtName = districts.find((district) => String(district.code) === selectedDistrict)?.name || "";
      const shippingAddress = [streetAddress.trim(), districtName, provinceName].filter(Boolean).join(", ");

      const created = await checkoutApi.createOrder({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: shippingAddress,
        note: note.trim(),
        paymentMethod,
        shippingFee: SHIPPING_FEE,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });

      setCreatedOrder(created);
      if (typeof window !== "undefined") {
        localStorage.setItem(CHECKOUT_ORDER_STORAGE_KEY, created.id);
      }
      clearCart();
      toast.success(
        paymentMethod === "cod"
          ? "Đơn hàng đã tạo. Shop sẽ gọi xác nhận trước khi giao."
          : "Đơn QR đã tạo. Vui lòng chờ shop xác nhận rồi thanh toán.",
      );
      setShowPayment(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo đơn hàng. Vui lòng kiểm tra lại sản phẩm.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0 && createdOrder) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/store" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#003966] mb-8">
          <ArrowLeft size={16} />
          Back to store
        </Link>

        <div className="street-card rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Mã đơn hàng</p>
              <h1 className="vintage-header text-3xl text-[#003966]">{buildOrderCode(createdOrder.id)}</h1>
              <p className="text-sm text-gray-500 mt-2">
                {createdOrder.fullName} · {createdOrder.phone}
              </p>
            </div>

            <div
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium",
                ORDER_STATUS_STYLES[createdOrder.status],
              )}
            >
              {ORDER_STATUS_LABELS[createdOrder.status]}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <h2 className="text-lg font-semibold text-[#003966] mb-3">Thông tin giao hàng</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-900">Địa chỉ:</span> {createdOrder.address}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Phương thức:</span>{" "}
                    {createdOrder.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Chuyển khoản QR"}
                  </p>
                  {createdOrder.note ? (
                    <p>
                      <span className="font-medium text-gray-900">Ghi chú:</span> {createdOrder.note}
                    </p>
                  ) : null}
                </div>
              </div>

              {createdOrder.paymentMethod === "qr" && (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
                    <div className="mx-auto w-full max-w-[220px] rounded-2xl bg-white p-3 shadow-sm">
                      <img src={qrImageUrl} alt="VietQR payment" className="w-full rounded-xl" />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2 text-[#003966] font-semibold">
                        <Smartphone size={16} /> Quét QR để thanh toán
                      </div>
                      <p>
                        <span className="font-medium text-gray-900">Số tiền:</span> {formatPrice(createdOrder.total)}
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">Nội dung chuyển khoản:</span>{" "}
                        {buildOrderCode(createdOrder.id)}
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">Tài khoản:</span> {VIETQR_ACCOUNT_NO}
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">Tên tài khoản:</span> {VIETQR_ACCOUNT_NAME}
                      </p>
                      {createdOrder.status === "wait_confirm" && (
                        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
                          Shop sẽ gọi xác nhận đơn trước. Sau khi shop xác nhận, bấm kiểm tra trạng thái rồi chuyển
                          khoản.
                        </p>
                      )}
                      {createdOrder.status === "confirmed" && (
                        <p className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700">
                          Đơn đã được xác nhận. Sau khi chuyển khoản, bấm nút xác nhận thanh toán bên dưới.
                        </p>
                      )}
                      {createdOrder.status === "shipping" && (
                        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                          Shop đã nhận thanh toán và đang giao đơn cho bạn.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRefreshOrder}
                      disabled={refreshingOrder}
                      className="border-[#003966]/20 text-[#003966]"
                    >
                      <RefreshCw size={16} className={cn("mr-2", refreshingOrder && "animate-spin")} />
                      Kiểm tra trạng thái
                    </Button>

                    <Button
                      type="button"
                      onClick={handleConfirmQrPayment}
                      disabled={createdOrder.status !== "confirmed" || confirmingQr}
                      className="bg-[#003966] hover:bg-[#003966]/90"
                    >
                      {confirmingQr ? "Đang xác nhận..." : "Tôi đã thanh toán QR"}
                    </Button>
                  </div>
                </div>
              )}

              {createdOrder.paymentMethod === "cod" && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  Shop sẽ gọi xác nhận đơn. Sau khi xác nhận, đơn COD sẽ chuyển sang trạng thái đang giao.
                </div>
              )}
            </div>

            <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm h-fit">
              <h2 className="text-lg font-semibold text-[#003966] mb-4">Chi tiết đơn hàng</h2>
              <div className="space-y-4">
                {createdOrder.details.map((detail) => (
                  <div key={detail.id} className="flex gap-3">
                    <img
                      src={resolveImageUrl(detail.product?.images?.[0] || "")}
                      alt={detail.product?.name || `Product ${detail.productId}`}
                      className="h-20 w-16 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {detail.product?.name || `Product ${detail.productId}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {detail.quantity}</p>
                      <p className="text-sm font-semibold text-[#003966] mt-2">{formatPrice(detail.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-gray-100 pt-4 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(createdOrder.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping fee</span>
                  <span>{formatPrice(createdOrder.shippingFee)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold text-[#003966] pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(createdOrder.total)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/store" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#003966] mb-8">
          <ArrowLeft size={16} />
          Back to store
        </Link>

        <div className="street-card rounded-2xl border-dashed border-gray-200 p-12 text-center">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-gray-300" />
          <h1
            className="vintage-header text-4xl sm:text-5xl font-bold text-[#003966] mb-2"
            style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
          >
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-6">Add some products before checkout.</p>
          <Button asChild>
            <Link href="/store">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/store" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#003966] mb-8">
        <ArrowLeft size={16} />
        Back to store
      </Link>

      <div className="mb-8">
        <h1
          className="vintage-header text-4xl sm:text-5xl font-bold text-[#003966]"
          style={{ fontFamily: "'Bebas Neue', 'Playfair Display', serif" }}
        >
          Checkout
        </h1>
        <p className="text-gray-500 mt-1">Fill in your delivery info and select COD or QR payment.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="street-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={20} className="text-[#003966]" />
              <h2 className="vintage-header text-2xl font-semibold text-[#003966]">Shipping information</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyen Van A"
                  disabled={isLoggedIn && !!fullName}
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                  disabled={isLoggedIn && !!phone}
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="House number, street, ward..."
                  rows={3}
                  disabled={isLoggedIn && !!streetAddress}
                />
              </div>

              <div>
                <Label>Province / City</Label>
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingProvinces ? "Loading provinces..." : "Select province / city"} />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={String(province.code)}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>District</Label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingDistricts ? "Loading districts..." : "Select district"} />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.code} value={String(district.code)}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional delivery note"
                  rows={3}
                />
              </div>
            </div>

            <Button onClick={handleContinueToPayment} className="mt-6 w-full h-11 bg-[#003966] hover:bg-[#003966]/90">
              Continue to payment
            </Button>
          </section>

          {showPayment && (
            <section className="street-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={20} className="text-[#003966]" />
                <h2 className="vintage-header text-2xl font-semibold text-[#003966]">Payment method</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    paymentMethod === "cod"
                      ? "border-[#003966] bg-blue-50"
                      : "border-gray-200 hover:border-[#003966]/40",
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Banknote size={20} className="text-[#003966]" />
                    <span className="font-semibold text-gray-900">Cash on Delivery</span>
                  </div>
                  <p className="text-sm text-gray-500">Pay when your order arrives at your address.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("qr")}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    paymentMethod === "qr"
                      ? "border-[#003966] bg-blue-50"
                      : "border-gray-200 hover:border-[#003966]/40",
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <QrCode size={20} className="text-[#003966]" />
                    <span className="font-semibold text-gray-900">QR Payment</span>
                  </div>
                  <p className="text-sm text-gray-500">Scan VietQR and transfer the exact order amount.</p>
                </button>
              </div>

              {paymentMethod === "cod" ? (
                <div className="mt-5 rounded-2xl bg-amber-50 border border-amber-100 p-4">
                  <div className="flex items-center gap-2 text-amber-700 font-medium mb-1">
                    <Banknote size={16} /> COD selected
                  </div>
                  <p className="text-sm text-amber-700/80">
                    Please keep your phone available for delivery confirmation.
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-center">
                    <div className="mx-auto w-full max-w-[220px] rounded-2xl bg-white p-3 shadow-sm">
                      <img src={qrImageUrl} alt="VietQR payment" className="w-full rounded-xl" />
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2 text-[#003966] font-semibold">
                        <Smartphone size={16} /> Scan QR to pay
                      </div>
                      <p>
                        <span className="font-medium text-gray-900">Bank BIN:</span> {VIETQR_BANK_BIN}
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">Account:</span> {VIETQR_ACCOUNT_NO}
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">Account name:</span> {VIETQR_ACCOUNT_NAME}
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">Amount:</span> {formatPrice(grandTotal)}
                      </p>
                      <p>
                        <span className="font-medium text-gray-900">Transfer content:</span> {orderCode}
                      </p>
                      <p className="text-xs text-gray-500 pt-2">
                        Use this as a demo QR flow until payment gateway integration is added.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="mt-6 w-full h-11 bg-[#003966] hover:bg-[#003966]/90"
              >
                {placingOrder ? "Processing..." : paymentMethod === "cod" ? "Place COD order" : "Create QR order"}
              </Button>
            </section>
          )}
        </div>

        <aside className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-[#003966] mb-5">Order summary</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <img
                  src={resolveImageUrl(item.product.images[0])}
                  alt={item.product.name}
                  className="h-20 w-16 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase text-gray-400">{item.product.brand}</p>
                  <p className="font-medium text-sm text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold text-[#003966] mt-2">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-gray-100 pt-4 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Shipping fee</span>
              <span>{formatPrice(SHIPPING_FEE)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-[#003966] pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
