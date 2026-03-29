"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Banknote, CheckCircle2, CreditCard, MapPin, QrCode, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { formatPrice, resolveImageUrl, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const grandTotal = total + (items.length > 0 ? SHIPPING_FEE : 0);
  const orderCode = useMemo(() => `TUDO-${Date.now().toString().slice(-8)}`, []);

  const qrImageUrl = useMemo(() => {
    const params = new URLSearchParams({
      amount: String(grandTotal),
      addInfo: orderCode,
      accountName: VIETQR_ACCOUNT_NAME,
    });

    return `https://img.vietqr.io/image/${VIETQR_BANK_BIN}-${VIETQR_ACCOUNT_NO}-compact2.png?${params.toString()}`;
  }, [grandTotal, orderCode]);

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

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setPlacingOrder(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      clearCart();
      toast.success(
        paymentMethod === "cod"
          ? "Order placed successfully with Cash on Delivery"
          : "Order created. Please complete QR payment.",
      );
      setShowPayment(false);
    } finally {
      setPlacingOrder(false);
    }
  };

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
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0901234567" />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="House number, street, ward..."
                  rows={3}
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
                {placingOrder ? "Processing..." : paymentMethod === "cod" ? "Place COD order" : "I have paid by QR"}
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
