"use client"

import { useState, useMemo, useEffect } from "react" // Added useMemo for sorting and useEffect
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useStatusCategory } from "@/app/Hooks/status-category"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



const StatusCategory = () => {
  const [open, setOpen] = useState(false)
  const [sortBy, setSortBy] = useState<string>('id') // State for sorting column
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc') // State for sort order
  const [searchTerm, setSearchTerm] = useState('') // State for search term

  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    name,
    description,
    isActive,
    setName,
    setDescription,
    setIsActive,
    setNameError,
    handleSave,
    handleEdit,
    handleDelete,
    loadCategories,
    nameError,
    editingId,
    loading,
    list,
    page,
    limit,
    totalCount,
    setPage,
    setLimit,
  } = useStatusCategory()

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

  //for switch
  const handleToggleStatus = async (id: number, isactive: boolean) => {
    try {
      await fetch(`/api/status-category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isactive }),
      })
      await loadCategories() // refresh table
    } catch (err) {
      console.error(err)
      toast.error("Failed to update status")
    }
  }
  
  return (
    <div className="space-y-13">
      <h1 className="scroll-m-20 mt-15 text-center text-4xl font-extrabold tracking-tight">
        Status-Category Page
      </h1>

      {/* card/Form to add or update status category */}
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="mt-6 mb-0 overflow-x-auto sm:max-w-6xl mx-auto">
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                    setOpen(true)
                  }}
            >
              Add Category
            </Button> 
          </DialogTrigger>
        </div>
      <DialogContent className="sm:max-w-xl"
          onInteractOutside={(e) => e.preventDefault()}
           onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {editingId ? "Update Status Category" : "Add Status Category"}
          </DialogTitle>
        </DialogHeader>
       <Card className="max-w-xl mx-100%">
        <CardHeader>
          <CardTitle>
            {editingId ? "Update Status Category" : "Add Status Category"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              const success = await handleSave()
              if (success) {
                setOpen(false)
              }
            }}
            className="space-y-4"
          >
            {/* Name */}
            <div className="space-y-1">
              <Label>Enter Category Name</Label>
              <Input
                placeholder="Status category name *"
                value={name}
                maxLength={100}
                onChange={(e) => {setName(e.target.value)
                                  setNameError("")}
                }className={nameError ? "border-red-500" : ""}
              />
                {nameError && (
                    <span className="text-red-500 text-sm">
                      {nameError}
                    </span>
                  )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label>Enter Description</Label>
              <Input
                placeholder="Description (optional)"
                value={description}
                maxLength={255}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => {
                  console.log("Checked:", checked)
                  setIsActive(checked === true) // important
                }}
              />
              <Label htmlFor="isActive">
                {isActive ? "Active" : "Inactive"}
              </Label>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {editingId ? "Update" : "Save"}
            </Button>
          </form>
        </CardContent>
       </Card>
       </DialogContent>
      </Dialog>

      {/* Table to display status categories */}
      {list.length > 0 && (
        <div className="mt-4  overflow-x-auto sm:max-w-6xl mx-auto">
          <div className="mb-6 sm:max-w-6xl mx-auto flex justify-end items-center">
            <Input
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(1)
                const params = new URLSearchParams(searchParams.toString())
                params.set('page', '1')
                router.push(`?${params.toString()}`, { scroll: false })
              }}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200 text-gray-800 border-b border-black">
                <TableHead>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col">
                      <ChevronUp className={`h-3 w-3 cursor-pointer ${sortBy === 'name' && sortOrder === 'asc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setSortBy('name'); setSortOrder('asc'); setPage(1); loadCategories(1, limit); }} />
                      <ChevronDown className={`h-3 w-3 cursor-pointer ${sortBy === 'name' && sortOrder === 'desc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setSortBy('name'); setSortOrder('desc'); setPage(1); loadCategories(1, limit); }} />
                    </div>
                    <span className="cursor-pointer" onClick={() => { setSortBy('id'); setSortOrder('asc'); setPage(1); loadCategories(1, limit); }}>Name</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col">
                      <ChevronUp className={`h-3 w-3 cursor-pointer ${sortBy === 'description' && sortOrder === 'asc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setSortBy('description'); setSortOrder('asc'); setPage(1); loadCategories(1, limit); }} />
                      <ChevronDown className={`h-3 w-3 cursor-pointer ${sortBy === 'description' && sortOrder === 'desc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setSortBy('description'); setSortOrder('desc'); setPage(1); loadCategories(1, limit); }} />
                    </div>
                    <span className="cursor-pointer" onClick={() => { setSortBy('id'); setSortOrder('asc'); setPage(1); loadCategories(1, limit); }}>Description</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col">
                      <ChevronUp className={`h-3 w-3 cursor-pointer ${sortBy === 'status' && sortOrder === 'asc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setSortBy('status'); setSortOrder('asc'); setPage(1); loadCategories(1, limit); }} />
                      <ChevronDown className={`h-3 w-3 cursor-pointer ${sortBy === 'status' && sortOrder === 'desc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setSortBy('status'); setSortOrder('desc'); setPage(1); loadCategories(1, limit); }} />
                    </div>
                    <span className="cursor-pointer" onClick={() => { setSortBy('id'); setSortOrder('asc'); setPage(1); loadCategories(1, limit); }}>Status</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.isactive}
                        onCheckedChange={(checked) => {
                          handleToggleStatus(item.id, checked)
                        }}
                      />
                      <span className="text-sm">
                        {item.isactive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>                 
                  <TableCell className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {handleEdit(item)
                        setOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm"  variant="destructive">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this category.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            Cancel
                          </AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>


            <div className="flex justify-end mt-15">

              <div className="flex items-center gap-2 mr-10">
                <Label>Rows per page:</Label>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => {
                    const newLimit = parseInt(value, 10)
                    setLimit(newLimit)
                    setPage(1)
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('page', '1')
                    params.set('limit', newLimit.toString())
                    router.push(`?${params.toString()}`, { scroll: false })
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center gap-3 ">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = page - 1
                    setPage(newPage)
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('page', newPage.toString())
                    router.push(`?${params.toString()}`, { scroll: false })
                  }}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                <span className="text-sm flex items-center">
                  Page {page}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = page + 1
                    setPage(newPage)
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('page', newPage.toString())
                    router.push(`?${params.toString()}`, { scroll: false })
                  }}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>                 

            </div>
        </div>
      )}
    </div>
  )
}

export default StatusCategory
