"use client"

import { useState } from "react" // Added useMemo for sorting and useEffect
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner";
import { z } from "zod"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useStatusCategory } from "@/app/Hooks/UseStatusCategory"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

// ADD REACT HOOK FORM
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// type FormData = {
//   name: string
//   description?: string
//   isactive: boolean
// }

 //zod validation
  const StatusCategoryFormData = z.object({
      name: z.string().min(1, "This field is required").max(100, "Name max 100 chars"),
      description: z.string().max(255, "Description max 255 chars").optional(),
    isactive: z.boolean(),
  })
  
  type StatusCategoryFormData = 
    z.infer<typeof StatusCategoryFormData>
  

const StatusCategory = () => {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const { setters, data, actions, ui, setEditingId  } = useStatusCategory()

  // REACT HOOK FORM INITIALIZATION
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StatusCategoryFormData>({
    resolver: zodResolver(StatusCategoryFormData),
    defaultValues: {
      name: "",
      description: "",
      isactive: true,
    },
  })

  // onsubmit form
  const onSubmit = async (data: StatusCategoryFormData) => {
    try {
      await actions.saveCategory(data)

      reset()
      setOpen(false)
      toast.success(
        ui.editingId
          ? "Status category updated"
          : "Status category created"
      )
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="space-y-13">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight">
        Status-Category Page
      </h1>

      {/* card/Form to add or update status category */}
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="mt-6 mb-0 overflow-x-auto sm:max-w-6xl mx-auto">
          <DialogTrigger asChild>
            <Button className="cursor-pointer" 
              onClick={() => {
                    reset()
                    setEditingId(null)
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
            {ui.editingId ? "Update Status Category" : "Add Status Category"}
          </DialogTitle>
        </DialogHeader>
       <Card className="max-w-xl mx-100%">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div className="space-y-1">
              <Label>Enter Category Name</Label>
              <Input
                placeholder="Status category name *"
                maxLength={100}
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
                {errors.name && (
                    <span className="text-red-500 text-sm">
                      {errors.name.message}
                    </span>
                  )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label>Enter Description</Label>
              <Input
                placeholder="Description (optional)"
                maxLength={255}
                 {...register("description")}
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
               <Controller
                    name="isactive"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
              <Label htmlFor="isActive">
                {control._formValues?.isactive ? "Active" : "Inactive"}
              </Label>
            </div>

            <Button type="submit" disabled={ui.loading} className="w-full">
              {ui.editingId ? "Update" : "Save"}
            </Button>

          </form>
        </CardContent>
       </Card>
       </DialogContent>
      </Dialog>

      {/* Table to display status categories */}
      {data.list.length > 0 ? (
        <div className="mt-4  overflow-x-auto sm:max-w-6xl mx-auto">
          <div className="mb-6 sm:max-w-6xl mx-auto flex justify-end items-center">
            <Input
              placeholder="Search by name or description"
              onChange={(e) => {
                setters.setSearchTerm(e.target.value)
                setters.setPage(1)
              }}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted border-b border-border">
                <TableHead>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col">
                      <ChevronUp className={`h-3 w-3 cursor-pointer ${data.sortBy === 'name' && data.sortOrder === 'asc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setters.setSortBy('name'); setters.setSortOrder('asc'); setters.setPage(1); ui.loadCategories(1, data.limit); }} />
                      <ChevronDown className={`h-3 w-3 cursor-pointer ${data.sortBy === 'name' && data.sortOrder === 'desc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setters.setSortBy('name'); setters.setSortOrder('desc'); setters.setPage(1); ui.loadCategories(1, data.limit); }} />
                    </div>
                    <span className="cursor-pointer" onClick={() => { setters.setSortBy('id'); setters.setSortOrder('asc'); setters.setPage(1); ui.loadCategories(1, data.limit); }}>Name</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col">
                      <ChevronUp className={`h-3 w-3 cursor-pointer ${data.sortBy === 'description' && data.sortOrder === 'asc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setters.setSortBy('description'); setters.setSortOrder('asc'); setters.setPage(1); ui.loadCategories(1, data.limit); }} />
                      <ChevronDown className={`h-3 w-3 cursor-pointer ${data.sortBy === 'description' && data.sortOrder === 'desc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setters.setSortBy('description'); setters.setSortOrder('desc'); setters.setPage(1); ui.loadCategories(1, data.limit); }} />
                    </div>
                    <span className="cursor-pointer" onClick={() => { setters.setSortBy('id'); setters.setSortOrder('asc'); setters.setPage(1); ui.loadCategories(1, data.limit); }}>Description</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <div className="flex flex-col">
                      <ChevronUp className={`h-3 w-3 cursor-pointer ${data.sortBy === 'status' && data.sortOrder === 'asc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setters.setSortBy('status'); setters.setSortOrder('asc'); setters.setPage(1); ui.loadCategories(1, data.limit); }} />
                      <ChevronDown className={`h-3 w-3 cursor-pointer ${data.sortBy === 'status' && data.sortOrder === 'desc' ? 'text-black' : 'text-gray-400'}`} onClick={() => { setters.setSortBy('status'); setters.setSortOrder('desc'); setters.setPage(1); ui.loadCategories(1, data.limit); }} />
                    </div>
                    <span className="cursor-pointer" onClick={() => { setters.setSortBy('id'); setters.setSortOrder('asc'); setters.setPage(1); ui.loadCategories(1, data.limit); }}>Status</span>
                  </div>
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.paginatedList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.description || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch className="cursor-pointer" 
                        checked={item.isactive}
                        onCheckedChange={(checked) => {
                          actions.handleToggleStatus(item.id, checked)
                        }}
                      />
                      <span className="text-sm">
                        {item.isactive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Button className="cursor-pointer" 
                      size="sm"
                      variant="outline"
                      onClick={() => {actions.handleEdit(item)
                         // SET VALUES FOR EDITING
                        setValue("name", item.name)
                        setValue("description", item.description || "")
                        setValue("isactive", item.isactive)
                        setOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm"  variant="destructive" className="cursor-pointer" >
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
                            onClick={() => actions.handleDelete(item.id)}
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

              <div className="flex items-center gap-2 mx-8">
                <Label>Rows per page:</Label>
                <Select
                  value={data.limit.toString()}
                  onValueChange={(value) => {
                    const newLimit = parseInt(value, 10)
                    setters.setLimit(newLimit)
                    setters.setPage(1)
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
                {/* privious */}
                <Button className="cursor-pointer" 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = data.page - 1
                    setters.setPage(newPage)
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('page', newPage.toString())
                    router.push(`?${params.toString()}`, { scroll: false })
                  }}
                  disabled={data.page === 1}
                >
                  Previous
                </Button>

                <span className="text-sm flex items-center">
                  Page {data.page}
                </span>

                  {/* next */}
                <Button className="cursor-pointer" 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = data.page + 1
                    setters.setPage(newPage)
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('page', newPage.toString())
                    router.push(`?${params.toString()}`, { scroll: false })
                  }}
                  disabled={data.page === data.totalPages}
                >
                  Next
                </Button>
              </div>

            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-16 gap-4 text-gray-500">
          <p className="text-lg font-medium">No records found</p>
          <p className="text-sm">Click below to add your first record</p>
        </div>
      )}
    </div>
  )
}

export default StatusCategory
