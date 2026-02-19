"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { statusCategoryService } from "../services/statusCategory.service"
import { z } from "zod"

export interface StatusCategory {
  id: number;
  name: string;
  description?: string;
  isactive: boolean;
}

export const useStatusCategory = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [list, setList] = useState<StatusCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('') // State for search term
  const [sortBy, setSortBy] = useState<string>('id') // State for sorting column
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc') // State for sort order

  //zod validation
  const StatusCategoryFormData = z.object({
    name: z.string().min(1, "This field is required").max(100, "Name max 100 chars"),
    description: z.string().max(255, "Description max 255 chars").optional(),
    isactive: z.boolean(),
  })
  
  type StatusCategoryFormData = 
    z.infer<typeof StatusCategoryFormData>


  // load categories
   const loadCategories = useCallback (
    async (currentPage = page, currentLimit = limit) => {
    try{
      const data = await statusCategoryService.getAll(
        currentPage,
        currentLimit
      );
      const items = Array.isArray(data.data.items) ? data.data.items : []
      setList(items)
      setTotalCount(data.data.totalCount ?? 0)
      return items
    }catch (error) {
    console.error(error)
    toast.error("Failed to load categories")
    return []
    }
  },[page,limit]
)

// save 
  const saveCategory = async (data: StatusCategoryFormData) => {
    try {
      if (editingId) {
        await statusCategoryService.update(editingId, data);
      } else {
        await statusCategoryService.create(data);
      }
      await loadCategories()
      setEditingId(null)
      setOpen(false)

    } catch (err) {
      console.error(err)
      throw err
    }
  }
  

// EDIT api call
  const handleEdit = (item: StatusCategory) => {
  setEditingId(item.id)
}

// DELETE api call
    const handleDelete = async (id: number) => {
        setLoading(true)
        try {
          await statusCategoryService.delete(id);
          toast.success("Record deleted Successfully")
        const items = await loadCategories(page, limit)
        // If the current page is empty after deletion and not page 1, go to previous page
        if (items.length === 0 && page > 1) {
            const newPage = page - 1
            setPage(newPage)
            const params = new URLSearchParams(searchParams.toString())
            params.set('page', newPage.toString())
            router.replace(`?${params.toString()}`, { scroll: false })
            await loadCategories(newPage, limit)
        }
        } catch (error) {
        console.error(error)
        toast.error("Failed to delete")
        } finally {
        setLoading(false)
        }
    }

    
  //for switch
  const handleToggleStatus = async (id: number, isactive: boolean) => {
    try {
      await fetch(`/api/status-category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isactive }),
      })
      await loadCategories(page, limit) // refresh table
    } catch (err) {
      console.error(err)
      toast.error("Failed to update status")
    }
  }

  // Sync page and limit from URL on mount and when URL changes
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '1', 10)
    const urlLimit = parseInt(searchParams.get('limit') || '5', 10)
    if (urlPage !== page || urlLimit !== limit) {
      setPage(urlPage)
      setLimit(urlLimit)
      loadCategories(urlPage, urlLimit)
    }
  }, [searchParams, page, limit, setPage, setLimit, loadCategories])

  const filteredAndSortedList = useMemo(() => { // Memoized filtered and sorted list for performance
    // First filter by search term
    const filtered = list.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Then sort
    if (sortBy === 'id') {
      return filtered // Return as is, since API already orders by ID ASC
    }
    return filtered.sort((a, b) => {
      let aVal: string | boolean | number, bVal: string | boolean | number
      if (sortBy === 'name') {
        aVal = a.name.toLowerCase()
        bVal = b.name.toLowerCase()
      } else if (sortBy === 'description') {
        aVal = (a.description || '').toLowerCase()
        bVal = (b.description || '').toLowerCase()
      } else if (sortBy === 'status') {
        aVal = a.isactive
        bVal = b.isactive
      } else {
        aVal = a.name.toLowerCase()
        bVal = b.name.toLowerCase()
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [list, sortBy, sortOrder, searchTerm])

  // Server-side pagination logic
  const totalPages = Math.ceil(totalCount / limit)
  const paginatedList = filteredAndSortedList // Since data is already paginated from server, but we apply client-side search/sort


//display data ...
  useEffect(() => {
  loadCategories(page, limit)
}, [loadCategories, page, limit])

// return
 return {
      setters: {
      setOpen,
      setPage,
      setLimit,
      setSearchTerm,
      setSortBy,
      setSortOrder,
    },

    data: {
      list,
      page,
      limit,
      totalPages,
      paginatedList,
      filteredAndSortedList,
      searchTerm, 
      sortBy, 
      sortOrder,
    },

    actions: {
      handleEdit,
      handleDelete,
      handleToggleStatus,
      saveCategory,
    },

    ui: {
      editingId,
      loading,
      loadCategories,
      open,
    },

    setEditingId,
 }

}
