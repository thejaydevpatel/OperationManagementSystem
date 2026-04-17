
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useDebounce } from "@/hooks/use-debounce";
 
import { useSearchParams } from "next/navigation";
 import { Switch } from "@/components/ui/switch";
import { exportToExcel } from "@/utils/exportToExcel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";

import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  MoreVertical,
  Loader2,
  Plus,
} from "lucide-react";

import { Pagination, ServiceOrder } from "@/app/api/utils/send-response";
import EmptyState from "@/components/ui/empty-state";

import { OperationJobsTableEntity } from "@/app/api/operation-jobs-lookup/operation-jobs-table/interface/operation-jobs-table";

interface operation_jobs_tablePaginationTableProps {
  rows: OperationJobsTableEntity[];
  onDelete: (Id: number) => void;
  onStatus: (Id: number) => void;
  onView: (Id: number) => void;
  onListToggle: () => void;
  module: ModuleDetailsString;
  setList: React.Dispatch<React.SetStateAction<OperationJobsTableEntity[]>>;
  customPage: number;
  customRowsPerPage: number;
  customSetPage: React.Dispatch<React.SetStateAction<number>>;
  customTotalRecordObj: Pagination;
  customSortBy: keyof OperationJobsTableEntity;
  customSetSortBy: React.Dispatch<React.SetStateAction<keyof OperationJobsTableEntity>>;
  customSetRowsPerPage: (rows: number) => void;
  customOrder: ServiceOrder;
  customSetOrder: React.Dispatch<React.SetStateAction<ServiceOrder>>;
  pageLoading: boolean;
}

function TablePaginationActions({
  count,
  page,
  rowsPerPage,
  onPageChange,
}: {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}) {
  return (
    <div className="flex items-center gap-2 ml-3">
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => onPageChange(e, 0)}
        disabled={page === 0}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={(e) =>
          onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
        }
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

const List: React.FC<operation_jobs_tablePaginationTableProps> = ({
  rows,
  onDelete,
  onStatus,
  onView,
  setList,
  customPage,
  customRowsPerPage,
  customSetPage,
  customTotalRecordObj,
   customSetRowsPerPage, 
  pageLoading,
}) => {
  const router = useRouter();

   const searchParams = useSearchParams();
  
   
const [vehicle_type_required, setVehicle_type_required] = React.useState<any[]>([]);


const [pickup_location_id, setPickup_location_id] = React.useState<any[]>([]);


const [dropoff_location_id, setDropoff_location_id] = React.useState<any[]>([]);


const [job_status_id, setJob_status_id] = React.useState<any[]>([]);


const [guide_language_required, setGuide_language_required] = React.useState<any[]>([]);


  // read page from url
  React.useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      customSetPage(Number(pageParam) - 1);
    }
  }, [searchParams]);
  

React.useEffect(() => {
  const fetchVehicle_type_required = async () => {
    const res = await fetch("/api/vehicle-types-lookup/vehicle-types-table?pageSize=9999");
    const data = await res.json();
    setVehicle_type_required(data.data || []);
  };

  fetchVehicle_type_required();
}, []);


React.useEffect(() => {
  const fetchPickup_location_id = async () => {
    const res = await fetch("/api/location-master-lookup/location-master-table?pageSize=9999");
    const data = await res.json();
    setPickup_location_id(data.data || []);
  };

  fetchPickup_location_id();
}, []);


React.useEffect(() => {
  const fetchDropoff_location_id = async () => {
    const res = await fetch("/api/location-master-lookup/location-master-table?pageSize=9999");
    const data = await res.json();
    setDropoff_location_id(data.data || []);
  };

  fetchDropoff_location_id();
}, []);


React.useEffect(() => {
  const fetchJob_status_id = async () => {
    const res = await fetch("/api/status-master-lookup/status-master-table?pageSize=9999");
    const data = await res.json();
    setJob_status_id(data.data || []);
  };

  fetchJob_status_id();
}, []);


React.useEffect(() => {
  const fetchGuide_language_required = async () => {
    const res = await fetch("/api/language-master-lookup/language-master-table?pageSize=9999");
    const data = await res.json();
    setGuide_language_required(data.data || []);
  };

  fetchGuide_language_required();
}, []);

  
  // update url when page changes
  const updatePageInUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (page + 1).toString());
    router.push("?" + params.toString());
  };

  const [searchText, setSearchText] = React.useState("");
  const debouncedSearch = useDebounce(searchText, 300);
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "active" | "suspended"
  >("all");

  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
   if (deleteId !== null) {
    onDelete(deleteId);
 if (filteredRows.length === 1 && customPage > 0) {
      const newPage = customPage - 1;
      customSetPage(newPage);
      updatePageInUrl(newPage);
    }
  }
        setDeleteId(null);
    setDeleteOpen(false);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const startIndex = customPage * customRowsPerPage;
    const endIndex = startIndex + customRowsPerPage;

    const currentPageRows = rows.slice(startIndex, endIndex);
    const reorderedPageRows = Array.from(currentPageRows);

    const [removed] = reorderedPageRows.splice(result.source.index, 1);
    reorderedPageRows.splice(result.destination.index, 0, removed);

    const updatedRows = [...rows];

    updatedRows.splice(
      startIndex,
      reorderedPageRows.length,
      ...reorderedPageRows
    );

    setList(updatedRows);
  };

const handleExport = () => {
  const exportData = filteredRows.map((row, index) => ({
    "Sr No.": index + 1,
    "External Booking Id": row.external_booking_id || "-",
    "Booking Type": row.booking_type || "-",
    "Service Type": row.service_type || "-",
    "Pax": row.pax || "-",

    "Vehicle Type":
      vehicle_type_required.find(v => Number(v.id) === Number(row.vehicle_type_required))?.name || "-",

    "Pickup Location":
      pickup_location_id.find(l => Number(l.id) === Number(row.pickup_location_id))?.name || "-",

    "Dropoff Location":
      dropoff_location_id.find(l => Number(l.id) === Number(row.dropoff_location_id))?.name || "-",

    "Scheduled Start Time": row.scheduled_start_time
      ? new Date(row.scheduled_start_time).toLocaleString("en-GB")
      : "-",

    "Scheduled End Time": row.scheduled_end_time
      ? new Date(row.scheduled_end_time).toLocaleString("en-GB")
      : "-",

    "Job Status":
      job_status_id.find(s => Number(s.id) === Number(row.job_status_id))?.name || "-",

    "Priority": row.priority || "-",
    "Notes": row.notes || "-",
    "Client": row.client || "-",
    "Agent": row.agent || "-",
    "Address": row.address || "-",

    "Guide Language":
      guide_language_required.find(l => Number(l.id) === Number(row.guide_language_required))?.name || "-",

    "Status": row.is_active ? "Active" : "Suspended",
  }));

  exportToExcel(exportData, "Operation_Jobs");
};
  
const filteredRows = rows.filter((row) => {
  if (statusFilter === "active" && !row.is_active) return false;
  if (statusFilter === "suspended" && row.is_active) return false;

  if (debouncedSearch) {
    const search = debouncedSearch.toLowerCase();
    return Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(search)
    );
  }

  return true;
});

  if (rows.length === 0 && !pageLoading) {
    return (
      <EmptyState
        title={`You haven't created any Operation Jobs Table yet`}
        description="Create your first record to get started."
        buttonText={`New Operation Jobs Table`}
       buttonHref="/dashboard/operation-jobs-lookup/operation-jobs-table/new"
        
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
                <Link
                  href="/dashboard/operation-jobs-lookup/operation-jobs-table/new"
                >
                  <Button className="min-w-[150px]">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New One Table
                  </Button>
                </Link>

        <div className="flex gap-2">
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline" onClick={handleExport}>
        Export
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      Export as Excel
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
          {/* <Button variant="outline">Import</Button> */}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-64"
        />

        <RadioGroup
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as "all" | "active" | "suspended")
          }
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All</Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem value="active" id="active" />
            <Label htmlFor="active">Active</Label>
          </div>

          <div className="flex items-center gap-2">
            <RadioGroupItem value="suspended" id="suspended" />
            <Label htmlFor="suspended">Suspended</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="overflow-auto max-h-[600px] mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr No.</TableHead>
              <TableHead>External Booking Id</TableHead>
<TableHead>Booking Type</TableHead>
<TableHead>Service Type</TableHead>
<TableHead>Pax</TableHead>
<TableHead>Vehicle Type Required</TableHead>
<TableHead>Pickup Location Id</TableHead>
<TableHead>Dropoff Location Id</TableHead>
<TableHead>Scheduled Start Time</TableHead>
<TableHead>Scheduled End Time</TableHead>
<TableHead>Job Status Id</TableHead>
<TableHead>Priority</TableHead>
<TableHead>Notes</TableHead>
<TableHead>Client</TableHead>
<TableHead>Agent</TableHead>
<TableHead>Address</TableHead>
<TableHead>Guide Language Required</TableHead>
              <TableHead>Status</TableHead>
              {/*<TableHead>Used/Unused</TableHead>*/}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="table-body">
              {(provided) => (
                <TableBody
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {pageLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filteredRows.length > 0 ? (
                    filteredRows.map((row, index) => (
                      <Draggable
                        key={row.id.toString()}
                        draggableId={row.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TableCell>{index + 1}</TableCell>

                            
  <TableCell>
    <p className="text-muted-foreground text-sm font-normal">
      {row.external_booking_id || "-"}
    </p>
  </TableCell>


  <TableCell>
    <p className="text-muted-foreground text-sm font-normal">
      {row.booking_type || "-"}
    </p>
  </TableCell>


  <TableCell>
    <p className="text-muted-foreground text-sm font-normal">
      {row.service_type || "-"}
    </p>
  </TableCell>


  <TableCell>
    <p className="text-muted-foreground text-sm font-normal">
      {row.pax || "-"}
    </p>
  </TableCell>


    <TableCell>
      <p className="text-muted-foreground text-sm font-normal">
    {vehicle_type_required.find(o => Number(o.id) === Number(row.vehicle_type_required))?.name || "-"}
      </p>
    </TableCell>
  

    <TableCell>
      <p className="text-muted-foreground text-sm font-normal">
    {pickup_location_id.find(o => Number(o.id) === Number(row.pickup_location_id))?.name || "-"}
      </p>
    </TableCell>
  

    <TableCell>
      <p className="text-muted-foreground text-sm font-normal">
    {dropoff_location_id.find(o => Number(o.id) === Number(row.dropoff_location_id))?.name || "-"}
      </p>
    </TableCell>
  

    <TableCell>
      <p className="text-muted-foreground text-sm font-normal">
        {row.scheduled_start_time
          ? new Date(row.scheduled_start_time).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-"}
      </p>
    </TableCell>
  

    <TableCell>
      <p className="text-muted-foreground text-sm font-normal">
        {row.scheduled_end_time
          ? new Date(row.scheduled_end_time).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-"}
      </p>
    </TableCell>
  

    <TableCell>
      <p className="text-muted-foreground text-sm font-normal">
    {job_status_id.find(o => Number(o.id) === Number(row.job_status_id))?.name || "-"}
      </p>
    </TableCell>
  

  <TableCell>
    <p className="text-muted-foreground text-sm font-normal">
      {row.priority || "-"}
    </p>
  </TableCell>


  <TableCell>
    <p className="text-muted-foreground text-sm font-normal">
      {row.notes || "-"}
    </p>
  </TableCell>


  <TableCell>
    <p className="text-muted-foreground text-sm font-normal">
      {row.client || "-"}
    </p>
  </TableCell>


  <TableCell>
    <p className="text-muted-foreground text-sm font-normal">
      {row.agent || "-"}
    </p>
  </TableCell>


  <TableCell>
    <p className="text-muted-foreground text-sm font-normal">
      {row.address || "-"}
    </p>
  </TableCell>


    <TableCell>
      <p className="text-muted-foreground text-sm font-normal">
    {guide_language_required.find(o => Number(o.id) === Number(row.guide_language_required))?.name || "-"}
      </p>
    </TableCell>
  

                      
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={row.is_active}
                                  onCheckedChange={() => onStatus(row.id)}
                                />
                                <span className="text-sm">
                                  {row.is_active ? "Active" : "Suspended"}
                                </span>
                              </div>
                            </TableCell>

                             {/* <TableCell>
                              <StatusBadge
                                label={row.is_used ? "Used" : "Unused"}
                              />
                            </TableCell> */}

                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                        onClick={() => router.push(`/dashboard/operation-jobs-lookup/operation-jobs-table/${row.id}`)}                                  >
                                    Edit
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDelete(row.id)
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No records found
                        <div className="mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchText("");
                              setStatusFilter("all");
                            }}
                          >
                            Reset Filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </div>

<div className="flex items-center justify-end gap-6 p-4 border-t">

  {/* Rows per page */}
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">
      Rows per page:
    </span>

    <Select
      value={customRowsPerPage.toString()}
      onValueChange={(value) => {
        const rows = Number(value);
        customSetRowsPerPage(rows);
        customSetPage(0);
        updatePageInUrl(0);
      }}
    >
      <SelectTrigger className="w-[80px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="5">5</SelectItem>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="25">25</SelectItem>
        <SelectItem value="50">50</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Page number */}
  <span className="text-sm text-muted-foreground">
    Page {customPage + 1}
  </span>

  {/* Pagination buttons */}
  <TablePaginationActions
    count={customTotalRecordObj?.totalRecords ?? 0}
    page={customPage}
    rowsPerPage={customRowsPerPage}
    onPageChange={(_, newPage) => {
      customSetPage(newPage);
      updatePageInUrl(newPage);
    }}
  />

</div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this record?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default List;
