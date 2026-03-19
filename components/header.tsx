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

export default function Header() {
  return (
        <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">My Application</h1>
            <SidebarTrigger />
          </div>
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5 cursor-pointer" />
            {/* <User className="h-5 w-5 cursor-pointer" /> */}
            <Dialog>
              <DialogTrigger asChild>
                <User className="h-5 w-5 cursor-pointer" />
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
                <DirectionToggle/>
                <ThemeToggle/>
          </div>
          <RouteProgress />
        </header>
  )
}
