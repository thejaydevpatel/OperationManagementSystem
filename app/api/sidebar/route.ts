import { NextResponse } from "next/server"
import { pool } from "@/lib/config"

export async function GET() {
  try {
    const result: any = await pool.query(`
      SELECT 
        m.id as module_id,
        m.name as module_name,
        m.icon as icon,  
        p.id as page_id,
        p.page_name,
        p.page_url as path,
        p.icon as page_icon 
      FROM master_lookup_modules m
      LEFT JOIN master_lookup_pages p 
        ON p.module_name = m.id
      ORDER BY m.order_index ASC, p.order_index ASC
    `)

    const rows = result.rows

    const grouped: any = []

    rows.forEach((row: any) => {
      let moduleItem = grouped.find((m: any) => m.id === row.module_id)

      if (!moduleItem) {
        moduleItem = {
  id: row.module_id,
  module_name: row.module_name,
  icon: row.icon,   // ✅ ADD THIS
  pages: [],
}
        grouped.push(moduleItem)
      }

      if (row.page_id) {
moduleItem.pages.push({
  id: row.page_id,
  page_name: row.page_name,
  path: row.path,
  icon: row.page_icon,   // ✅ ADD THIS
})
      }
    })

    return NextResponse.json(grouped)

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error fetching sidebar" })
  }
}