"use client"
import { RouteProgress } from "@/components/route-progress"
// import { Home, Settings, Users } from "lucide-react"
import { Bell, User } from "lucide-react"
import {
  Dialog,
  DialogClose ,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "./theme-toggle"
import DirectionToggle from "@/components/direction-toggle";
import Image from "next/image";
 import Link from "next/link";
 import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {

  const [user,setUser] = useState<any>(null);
const [notifications, setNotifications] = useState<any[]>([]);
const [openNotif, setOpenNotif] = useState(false);

  useEffect(()=>{
  fetch("/api/admin-me")
    .then(res=>res.json())
    .then(data=>setUser(data));
},[]);

const router = useRouter();

const handleLogout = async () => {

  await fetch("/api/admin-logout",{
    method:"POST"
  });

  // toast.success("Logged out");

  toast.success("Logged out",{
  position:"top-center"
});

  router.push("/admin-login");

};

const fetchNotifications = async () => {
  try {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setNotifications(data);
  } catch (err) {
    console.error(err);
  }
};

  return (
    
        <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-4">
            {/* <h1 className="text-lg font-semibold">My Application</h1> */}
            <Link href="/dashboard">
              <Image
                src="/techno-logo-main.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto cursor-pointer"
              />
            </Link>
            
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-4">
            
            {/* <User className="h-5 w-5 cursor-pointer" /> */}
        <Dialog>
          <DialogTitle />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg hover:bg-muted/50 transition">
                    
                    {/* User Code */}
                    <span className="text-sm font-medium">
                      {user?.code || "Loading..."}
                    </span>

                    {/* Icon */}
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                </DialogTrigger>
              </TooltipTrigger>

              <TooltipContent>
                <p>View Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
            
            {/* Header */}
            <div className="px-5 py-4 border-b bg-muted/40 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-3">
              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">User Code</p>
                <p className="text-sm font-medium">{user?.code}</p>
              </div>

              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium">{user?.name}</p>
              </div>

              <div className="p-3 border rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t cursor-pointer flex justify-end">
              <DialogClose asChild>
                <button className="text-xs text-primary px-3 py-1 rounded-md transition-colors hover:bg-muted hover:text-foreground cursor-pointer">
                  Close
                </button>
              </DialogClose>
            </div>

          </DialogContent>
        </Dialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <LogOut
                className="h-5 w-5 cursor-pointer text-muted-foreground 
                hover:text-red-500 transition"
                onClick={handleLogout}
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
            
                {/* <Bell className="ml-2 mr-2 h-5 w-5 cursor-pointer" /> */}
        <Dialog open={openNotif} onOpenChange={setOpenNotif}>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Bell
                    className="ml-2 mr-2 h-5 w-5 cursor-pointer"
                    onClick={fetchNotifications}
                  />
                </DialogTrigger>
              </TooltipTrigger>

              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Updates</DialogTitle>
              <DialogDescription>
                Latest Notifications
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 mt-3 max-h-60 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No notifications
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 border rounded-lg text-sm"
                  >
                    <p className="font-medium">{n.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        <TooltipProvider>
          <div className="flex items-center gap-2">
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <DirectionToggle />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Direction</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ThemeToggle />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Theme</p>
              </TooltipContent>
            </Tooltip>

          </div>
        </TooltipProvider>
          </div>
          <RouteProgress />
        </header>
  )
}
