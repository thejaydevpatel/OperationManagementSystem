import fs from "fs";
import path from "path";

interface Field {
  name: string;
  type: string;
  nullable?: boolean;
  primaryKey?: boolean;
  toShowOnLayout:boolean;
  specificControl:string;
    refTable?: string;  

}

export function toPascalCaseText(str: string) {
  return str
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function generateListComponent(
  moduleName: string,
  tableName: string,
  fields: Field[],
  isChildPage: boolean,
  mainTable: string
) {
  const dirPath = path.join(
    process.cwd(),
     "app",
    "components",
    moduleName.replaceAll("_", "-"),
    tableName.replaceAll("_", "-")
  );

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, "list.tsx");

  if (fs.existsSync(filePath)) {
    console.log(
      `⚠️ list.tsx already exists for ${moduleName}/${tableName}, skipping.`
    );
    return;
  }

  // Generate PascalCase entity name from tableName
  const entityName =
    tableName
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("") + "Entity";

  // Filter fields to show as columns (you can adjust criteria here)
  // For example exclude fields like id, created_at, updated_at if you want.
  // But for now, let's include all except system fields named 'id' or similar
  const visibleFields = fields.filter(
    (f) => f.name !== "id" && f.toShowOnLayout && f.name !== "is_active"
  );

  // Generate TableCell headers from visibleFields names (capitalized & spaced)
  const headers = visibleFields.map((f) => {
    // simple camelCase to words, or snake_case to spaced words:
    return {
      pascalName: f.name
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase()),
      small_case: f.name,
    };
  });


  const tableCells = visibleFields
  .map((f) => {
    // FILE / IMAGE FIELD
    if (f.specificControl?.toLowerCase().includes("file")) {
      return `
        <TableCell>
          <img
            src={\`/images/${moduleName}_${tableName}/\${row.${f.name} || "-"}\`}
            alt="${f.name}"
            className="w-14 h-14 object-cover rounded-md border"
          />
        </TableCell>
      `;
    }

    // BOOLEAN FIELD
    if (f.type === "BOOLEAN") {
      return `
        <TableCell>
          <span className="text-sm font-medium">
            {row.${f.name} ? "Yes" : "No"}
          </span>
        </TableCell>
      `;
    }

    // DEFAULT TEXT FIELD
    // RADIO / DROPDOWN SHOW LABEL
if (
  f.specificControl === "Radio" ||
  f.specificControl === "NormalDropDown"
) {
  return `
    <TableCell>
      <p className="text-muted-foreground text-sm font-normal">
    {${f.name}.find(o => Number(o.id) === Number(row.${f.name}))?.name || "-"}
      </p>
    </TableCell>
  `;
}
// DATE / TIME FIELD
if (
  f.type === "TIMESTAMP" ||
  f.type === "TIMESTAMP WITH TIME ZONE" ||
  f.specificControl === "TimePicker" ||
  f.specificControl === "DateTimePicker"
) {
  return `
    <TableCell>
      <p className="text-muted-foreground text-sm font-normal">
        {row.${f.name}
          ? new Date(row.${f.name}).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-"}
      </p>
    </TableCell>
  `;
}

// DEFAULT TEXT FIELD
return `
  <TableCell>
    <p className="text-muted-foreground text-sm font-normal">
      {row.${f.name} || "-"}
    </p>
  </TableCell>
`;
  })
  .join("\n");

const content = `
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useDebounce } from "@/hooks/use-debounce";
 
import { useSearchParams } from "next/navigation";
 import { Switch } from "@/components/ui/switch";
  import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
 } from "@/components/ui/tooltip";
import { exportToExcel } from "@/utils/exportToExcel";
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

${
  isChildPage
    ? `import { ${entityName} } from "@/app/api/${moduleName.replaceAll(
        "_",
        "-"
      )}/${mainTable.replaceAll("_", "-")}/[id]/${tableName.replaceAll(
        "_",
        "-"
      )}/interface/${tableName.replaceAll("_", "-")}";`
    : `import { ${entityName} } from "@/app/api/${moduleName.replaceAll(
        "_",
        "-"
      )}/${tableName.replaceAll("_", "-")}/interface/${tableName.replaceAll(
        "_",
        "-"
      )}";`
}

interface ${tableName}PaginationTableProps {
  rows: ${entityName}[];
  onDelete: (Id: number) => void;
  onStatus: (Id: number) => void;
  onView: (Id: number) => void;
  onListToggle: () => void;
  module: ModuleDetailsString;
  setList: React.Dispatch<React.SetStateAction<${entityName}[]>>;
  customPage: number;
  customRowsPerPage: number;
  customSetPage: React.Dispatch<React.SetStateAction<number>>;
  customTotalRecordObj: Pagination;
  customSortBy: keyof ${entityName};
  customSetSortBy: React.Dispatch<React.SetStateAction<keyof ${entityName}>>;
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

const List: React.FC<${tableName}PaginationTableProps> = ({
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
  
   ${visibleFields
  .filter(
    (f) =>
      f.specificControl === "Radio" ||
      f.specificControl === "NormalDropDown"
  )
  .map(
    (f) => `
const [${f.name}, set${f.name.charAt(0).toUpperCase() + f.name.slice(1)}] = React.useState<any[]>([]);
`
  )
  .join("\n")}

  // read page from url
  React.useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      customSetPage(Number(pageParam) - 1);
    }
  }, [searchParams]);
  
${visibleFields
  .filter(
    (f) =>
      f.specificControl === "Radio" ||
      f.specificControl === "NormalDropDown"
  )
  .map((f) => {
    const setter =
      f.name.charAt(0).toUpperCase() + f.name.slice(1);

    const parts = f.refTable?.split("_lookup_") || [];
    const modulePart = parts[0] + "_lookup";
    const tablePart = parts[1];

    const moduleSlug = modulePart.replaceAll("_", "-");
    const tableSlug = tablePart.replaceAll("_", "-");

    return `
React.useEffect(() => {
  const fetch${setter} = async () => {
    const res = await fetch("/api/${moduleSlug}/${tableSlug}?pageSize=9999");
    const data = await res.json();
    set${setter}(data.data || []);
  };

  fetch${setter}();
}, []);
`;
  })
  .join("\n")}
  
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
    "Sr No": index + 1,
    ${visibleFields.map((f) => {

      // Column Name Formatting
      const colName = f.name
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());

      // Dropdown / Radio
      if (
        f.specificControl === "Radio" ||
        f.specificControl === "NormalDropDown"
      ) {
return `"${colName}":
  ${f.name}?.find?.(o => Number(o.id) === Number(row.${f.name}))?.name || ""`;
      }

      // Boolean
      if (f.type === "BOOLEAN") {
        return `"${colName}":
  row.${f.name} ? "Yes" : "No"`;
      }

      // Date
      if (
        f.type === "TIMESTAMP" ||
        f.type === "TIMESTAMP WITH TIME ZONE"
      ) {
        return `"${colName}":
  row.${f.name}
    ? new Date(row.${f.name}).toLocaleString("en-GB")
    : ""`;
      }

      // Default
      return `"${colName}": row.${f.name}`;
    }).join(",\n")}
  }));

  exportToExcel(
    exportData,
    "${tableName}",
    "${toPascalCaseText(tableName)}"
  );
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
        title={\`You haven't created any ${toPascalCaseText(tableName)} yet\`}
        description="Create your first record to get started."
        buttonText={\`New ${toPascalCaseText(tableName)}\`}
       buttonHref="/dashboard/${moduleName.replaceAll("_","-")}/${tableName.replaceAll("_","-")}/new"
        
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
                <Link
                  href="/dashboard/${moduleName.replaceAll("_","-")}/${tableName.replaceAll("_","-")}/new"
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
              ${headers.map((h) => `<TableHead>${h.pascalName}</TableHead>`).join("\n")}
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

                            ${tableCells}

                      
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
                                        onClick={() => router.push(\`/dashboard/${moduleName.replaceAll("_","-")}/${tableName.replaceAll("_","-")}/\${row.id}\`)}                                  >
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
`;
  if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, content, "utf8");
}
}

