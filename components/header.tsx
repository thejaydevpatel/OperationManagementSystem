"use client"
import { RouteProgress } from "@/components/route-progress"
// import { Home, Settings, Users } from "lucide-react"
import { Bell, User } from "lucide-react"
import {
  Dialog,
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
 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function Header() {

  const [user,setUser] = useState<any>(null);

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

  return (
    
        <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-4">
            {/* <h1 className="text-lg font-semibold">My Application</h1> */}
              <Image
                src="/techno-logo-main.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-4">
            
            {/* <User className="h-5 w-5 cursor-pointer" /> */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 cursor-pointer">
                      {/* <span className="text-sm font-medium">JAYD001</span>  */}
                      <span className="text-sm font-medium">
                        {user?.code}
                      </span>
                      <User className="h-5 w-5" />
                    </div>

                </div>
                    
                  
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>User Details</DialogTitle>
                  <DialogDescription>
                    Logged in user information
                  </DialogDescription>
                </DialogHeader>
                  <div className="space-y-3 mt-4">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Name</p>
                      {/* <p className="font-medium">Jaydev Patel</p> */}
                      <p className="font-medium">{user?.name}</p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Email</p>
                      {/* <p className="font-medium">jaydev@email.com</p> */}
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>

                  
              </DialogContent>
            </Dialog>

                      <LogOut
                        className="h-5 w-5 cursor-pointer text-muted-foreground 
                        hover:text-red-500 transition"
                        onClick={handleLogout}
                      />
            
                <Bell className="ml-2 mr-2 h-5 w-5 cursor-pointer" />
                <DirectionToggle/>
                <ThemeToggle/>
          </div>
          <RouteProgress />
        </header>
  )
}
