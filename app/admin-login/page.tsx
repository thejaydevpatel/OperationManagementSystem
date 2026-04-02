"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff, Shield } from "lucide-react";

export default function AdminLoginPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    try {
      setLoading(true);

      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }) // send name instead of email
      });

      const data = await res.json();

      if(res.ok){
        toast.success("Login Success", { position: "top-center" });
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }

    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }

  };

  const handleKey = (e: any) => {
    if(e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 
      dark:from-black dark:via-slate-900 dark:to-black">

      <Card className="w-[420px] p-8 backdrop-blur-xl bg-white/10 dark:bg-white/5 
        border border-white/20 shadow-2xl rounded-2xl">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-xl bg-primary/20 mb-2">
            <Shield className="h-7 w-7 text-primary"/>
          </div>
          <h2 className="text-2xl font-bold tracking-wide text-white">
            Admin Portal
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Secure access to dashboard
          </p>
        </div>

        {/* NAME */}
        <div className="space-y-2 mb-4">
          <Label className="text-white/80">Name</Label>
          <Input
            onKeyDown={handleKey}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-2 mb-6 relative">
          <Label className="text-white/80">Password</Label>
          <Input
            type={show ? "text" : "password"}
            onKeyDown={handleKey}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="bg-white/20 border-white/30 text-white pr-10 placeholder:text-white/50"
          />

          <div
            onClick={() => setShow(!show)}
            className="absolute right-3 top-9 cursor-pointer text-white/70 hover:text-white"
          >
            {show ? <EyeOff size={18}/> : <Eye size={18}/>}
          </div>
        </div>

        {/* BUTTON */}
        <Button
          className="w-full h-11 text-md font-semibold"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

      </Card>

    </div>
  );
}