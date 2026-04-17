import DashboardLayoutClient from "./DashboardLayoutClient"
import { cookies } from "next/headers"

export default async function Layout({ children }) {
  // get role from cookie (server side)
  const cookieStore = await cookies()
  const role = cookieStore.get("admin_role")?.value || null

  // fetch sidebar data (server side)
  const res = await fetch("http://localhost:3000/api/sidebar", {
    cache: "no-store",
  })

  const dbModules = await res.json()

  return (
    <DashboardLayoutClient role={role} dbModules={dbModules}>
      {children}
    </DashboardLayoutClient>
  )
}