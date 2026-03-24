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

export default function Header() {
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
                    <div className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm font-medium">JAYD001</span> {/* 👈 static code */}
                      <User className="h-5 w-5" />
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
                      <p className="font-medium">Jaydev Patel</p>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">jaydev@email.com</p>
                    </div>
                  </div>
              </DialogContent>
            </Dialog>
            
                <Bell className="ml-2 mr-2 h-5 w-5 cursor-pointer" />
                <DirectionToggle/>
                <ThemeToggle/>
          </div>
          <RouteProgress />
        </header>
  )
}
