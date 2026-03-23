"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { useAdminLogin } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAdminLogin();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login.mutateAsync({ username, password });
      if (result.user.role !== "admin") {
        toast.error("Only admin role can access this area");
        return;
      }

      localStorage.setItem("admin_token", result.token);
      localStorage.setItem("admin_user", JSON.stringify(result.user));
      toast.success("Login successful");
      router.push("/admin/analytics");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-[#003966]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin Login
          </CardTitle>
          <p className="text-sm text-gray-500">Sign in to access product management</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <div className="relative mt-1">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 " />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
