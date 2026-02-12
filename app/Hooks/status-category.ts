"use client"

import { useEffect, useState, useCallback } from "react"
import { z } from "zod"
import { toast } from "sonner"

//type define
type StatusCategory = {
  id: number
  name: string
  description: string
  isactive: boolean
}
export const useStatusCategory = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [list, setList] = useState<StatusCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [nameError, setNameError] = useState("");
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [totalCount, setTotalCount] = useState(0)

  // Zod validation schema
  const schema = z.object({
    name: z.string().min(1, "This field is required").max(100, "Name max 100 chars"),
    description: z.string().max(255, "Description max 255 chars").optional(),
    isactive: z.boolean(),
  })

  // load categories
   const loadCategories = useCallback (
    async (currentPage = page, currentLimit = limit) => {
    try{
      const res = await fetch(`/api/status-category?page=${currentPage}&limit=${currentLimit}`)
      const data = await res.json()
      setList(Array.isArray(data.data.items) ? data.data.items : [])
      setTotalCount(data.data.totalCount ?? 0)
    }catch (error) {
    console.error(error)
    toast.error("Failed to load categories")
    }
  },[page,limit]
)
  // CREATE / UPDATE category api call
    const handleSave = async (): Promise<boolean> => {
    setLoading(true)
    try {
      setNameError("")
      //  Validate with Zod
      const result = schema.safeParse({ name, description, isactive: isActive })
      if (!result.success) {
        const message =
        result.error.issues[0]?.message ?? "Validation failed"
        setNameError(message)
        return false
      }

      //  Check unique name on frontend
      if (list.some((item) => item.name.toLowerCase() === name.trim().toLowerCase() && item.id !== editingId)) {
        setNameError("Name must be unique")
        return false
      }

      //  Call API
      const res = await fetch(
        editingId ? `/api/status-category/${editingId}` : "/api/status-category",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, isactive: isActive }),
        }
      )

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Failed to save")
        return false
      }

      // Refresh list
      await loadCategories()

      //  Reset form
      setName("")
      setDescription("")
      setEditingId(null)
      setIsActive(true)

      //Confirmation message
      toast.success(
        editingId ? "Status category updated" : "Status category created"
      );
      return true
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong");
      return false
    } finally {
      setLoading(false)
    }
  }

// EDIT api call
  const handleEdit = (item: StatusCategory) => {
  setName(item.name)
  setDescription(item.description || "")
  setIsActive(item.isactive)
  setEditingId(item.id)
}

// DELETE api call

    const handleDelete = async (id: number) => {
        setLoading(true)
        toast.success("Record deleted Successfully")
        try {
        await fetch(`/api/status-category/${id}`, {
            method: "DELETE",
        })
        await loadCategories()
        } catch (error) {
        console.error(error)
        toast.error("Failed to delete")
        } finally {
        setLoading(false)
        }
    }

//display data ... 
  useEffect(() => {
  loadCategories()
}, [loadCategories])

// return
 return {
  // form fields
  name,
  description,
  isActive,
  open,
  nameError,

  // setters
  setName,
  setDescription,
  setIsActive,
  setOpen,
  setNameError,
  setPage,
  setLimit,

  // data
  list,
  page,
  limit,
  totalCount,

  // actions
  handleSave,
  handleEdit,
  handleDelete,

  // ui state
  editingId,
  loading,
  loadCategories,
 }

}
