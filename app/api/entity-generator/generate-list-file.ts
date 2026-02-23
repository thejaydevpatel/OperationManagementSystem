import fs from "fs";
import path from "path";

export function toPascalCaseText(str: string) {
  return str
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function generateListComponent(
  moduleName: string,
  tableName: string,
  fields: any[],
  isChildPage: boolean,
  mainTable: string
) {
  const dirPath = path.join(
    process.cwd(),
    "src",
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

  // Generate TableCell content template for each field
  // For special fields like image URLs or boolean, you can customize (optional)
  // Here I'll just print the field values; user can customize later.
  const tableCells = visibleFields
    .map((f) => {
      if (f.specificControl.toLowerCase().includes("file")) {
        // Render image/avatar for logo or image fields
        return `<TableCell>
          <Avatar
            src={\`/images/${moduleName}_${tableName}/\` + row.${f.name}}
            alt="${f.name}"
            sx={{ width: 56, height: 56 }}
          />
        </TableCell>`;
      }
      if (f.type === "BOOLEAN") {
        return `<TableCell>
        <Typography variant="subtitle2">{row.${f.name} ? "Yes" : "No"}</Typography>
      </TableCell>`;
      }
      return `<TableCell>
      <Typography color="textSecondary" variant="h6" fontWeight="400">
        {row.${f.name}}
      </Typography>
    </TableCell>`;
    })
    .join("\n");

  const content = `

"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Typography,
  TableHead,
  Box,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableFooter,
  IconButton,
  TableContainer,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  Avatar,
  Stack,
  Menu,
  TableSortLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Paper,
} from "@mui/material";

import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import PageContainer from "@/app/components/container/PageContainer";
import ParentCard from "@/app/components/shared/ParentCard";
import BlankCard from "@/app/components/shared/BlankCard";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

 

  ${
    isChildPage
      ? `import { ${entityName} } from "@/app/api/${moduleName.replaceAll(
          "_",
          "-"
        )}/${mainTable.replaceAll("_", "-")}/[id]/${tableName.replaceAll(
          "_",
          "-"
        )}/interface/${tableName.replaceAll("_", "-")}"`
      : `import { ${entityName} } from "@/app/api/${moduleName.replaceAll(
          "_",
          "-"
        )}/${tableName.replaceAll("_", "-")}/interface/${tableName.replaceAll(
          "_",
          "-"
        )}"`
  }

  
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import Link from "next/link";
import { ModuleDetailsString } from "@/app/(DashboardLayout)/types/module-details/ModuleDetails";
import EmptyState from "@/app/components/utils/controls/EmptyState/empty-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Pagination, ServiceOrder } from "@/app/api/utils/send-response";
import { useDebounce } from "@/app/components/libs/de-bounce";
import CircularProgress from "@mui/material/CircularProgress";
import StatusBadge from "@/app/components/mui-icons/un-used";

interface ${tableName}PaginationTableProps {
  rows: ${entityName}[];
  onDelete: (Id: number) => void;
  onStatus: (Id: number) => void;
  onView: (Id: number) => void;
  module: ModuleDetailsString;
  onListToggle: (Id: number) => void;
  setList: React.Dispatch<React.SetStateAction<${entityName}[]>>;
  customPage: number;
    customRowsPerPage: number;
    customSetPage: React.Dispatch<React.SetStateAction<number>>;
    customSetRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
    customTotalRecordObj: Pagination;
    customSortBy: keyof ${entityName};
    customSetSortBy: React.Dispatch<React.SetStateAction<keyof ${entityName}>>;
    customOrder: ServiceOrder;
    customSetOrder: React.Dispatch<React.SetStateAction<ServiceOrder>>;
    pageLoading: boolean;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: any) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: any) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: any) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: any) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const List: React.FC<${tableName}PaginationTableProps> = ({
  rows,
  onDelete,
  onStatus,
  onView,
  module,
  onListToggle,
  setList,
  customPage,
  customRowsPerPage,
  customSetPage,
  customSetRowsPerPage,
  customTotalRecordObj,
  customSortBy,
  customSetSortBy,
  customOrder,
  customSetOrder,
  pageLoading,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [deleteopen, setdeleteopen] = React.useState(false);

  const [openRowId, setOpenRowId] = React.useState<number | null>(null);

  const [searchText, setSearchText] = React.useState("");
    const debouncedSearch = useDebounce(searchText, 300);
    const [statusFilter, setStatusFilter] = React.useState<
      "all" | "active" | "suspended"
    >("all");


    const router = useRouter();
    const pathname = usePathname();
  
    const handleMenuClick = (
      event: React.MouseEvent<HTMLElement>,
      rowId: number
    ) => {
      setAnchorEl(event.currentTarget);
      setOpenRowId(rowId);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
      setOpenRowId(null);
    };
  

  const handleDelete = (Id: number) => {
    handleClickOpen(Id);
  };

  const handleClickOpen = (Id: number) => {
    setDeleteId(Id);
    setdeleteopen(true);
  };
  const handleCloseDelete = () => {
    setDeleteId(null);
    setdeleteopen(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      onDelete(deleteId);
    }
    handleCloseDelete();
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSort = (property: keyof ${entityName}) => {
      
      const isAsc = customSortBy === property && customOrder === "asc";
      customSetOrder(isAsc ? "desc" : "asc");
      customSetSortBy(property);
    };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

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

          const filteredRows = React.useMemo(() => {
              return rows.filter((row) => {
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
            }, [rows, statusFilter, debouncedSearch]);


            
  //const paginatedRows  = rows;
  
       if (rows.length === 0 && !pageLoading) {
          return (
            <EmptyState
              title="You haven't created any ${toPascalCaseText(tableName)} yet"
              description="Assign folder and dashboard permissions to teams instead of users to ease administration."
              buttonText="New ${toPascalCaseText(tableName)}"
              buttonHref={${
                isChildPage
                  ? `\`/apps/${moduleName
                      .toLowerCase()
                      .replaceAll("_", "-")}/${mainTable
                      .toLowerCase()
                      .replaceAll(
                        "_",
                        "-"
                      )}/\${module.mainServiceId}/${tableName
                      .toLowerCase()
                      .replaceAll("_", "-")}/new\``
                  : `\`/apps/${moduleName
                      .toLowerCase()
                      .replaceAll("_", "-")}/${tableName
                      .toLowerCase()
                      .replaceAll("_", "-")}/new\``
              }}
            />
          );
          }



  return (
    <>
 
            <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={5}
                >
                  <Box>
                    <Link href={${
                      isChildPage
                        ? `\`/apps/${moduleName
                            .toLowerCase()
                            .replaceAll("_", "-")}/${mainTable
                            .toLowerCase()
                            .replaceAll(
                              "_",
                              "-"
                            )}/\${module.mainServiceId}/${tableName
                            .toLowerCase()
                            .replaceAll("_", "-")}/new\``
                        : `\`/apps/${moduleName
                            .toLowerCase()
                            .replaceAll("_", "-")}/${tableName
                            .toLowerCase()
                            .replaceAll("_", "-")}/new\``
                    }} passHref>
                      <Button color="primary" variant="contained"  startIcon={
                                      <AddCircleOutlineIcon
                                        fontSize="medium"
                                        sx={{ marginRight: 0.5 }}
                                      />
                                    } >
                        Add New ${toPascalCaseText(tableName)}
                      </Button>
                    </Link>
                  </Box>
          
                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" color="primary">
                      Export
                    </Button>
                    <Button variant="outlined" color="secondary">
                      Import
                    </Button>
                  </Stack>
                </Stack>


      <Box mt="-20px">
        <PageContainer
          title={\`\${module.subkeyWord}\${module.keyWord}\`}
          description={\`\${module.subkeyWord}\${module.keyWord}\`}
        >
          <ParentCard title="All ${toPascalCaseText(tableName)}">
            <BlankCard>

              <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={2}
                              mt={2}
                              mx={2}
                            >
                              <TextField
                                size="small"
                                label="Search..."
                                variant="outlined"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                sx={{ width: 250 }}
                              />
            
                              <RadioGroup
                                row
                                value={statusFilter}
                                onChange={(e) =>
                                  setStatusFilter(
                                    e.target.value as "all" | "active" | "suspended"
                                  )
                                }
                              >
                                <FormControlLabel
                                  value="all"
                                  control={
                                    <Radio
                                      sx={{
                                        color: 'primary.main',
                                        "&.Mui-checked": {
                                          color: 'primary.main',
                                        },
                                      }}
                                    />
                                  }
                                  label="All"
                                />
                                <FormControlLabel
                                  value="active"
                                  control={
                                    <Radio
                                      sx={{
                                        color: 'secondary.main',
                                        "&.Mui-checked": {
                                          color:'secondary.main',
                                        },
                                      }}
                                    />
                                  }
                                  label="Active"
                                />
                                <FormControlLabel
                                  value="suspended"
                                  control={
                                    <Radio
                                      sx={{
                                        color: 'error.main',
                                        "&.Mui-checked": {
                                          color: 'error.main',
                                        },
                                      }}
                                    />
                                  }
                                  label="Suspended"
                                />
                              </RadioGroup>
                            </Box>


              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table
                  aria-label="custom pagination table"
                  stickyHeader
                  sx={{ whiteSpace: "nowrap" }}
                >
                  <TableHead>
                    <TableRow>
                     <TableCell
                                               sortDirection={
                                                 customSortBy === "id" ? customOrder : false
                                               }
                                             >
                                               <TableSortLabel
                                                 active={customSortBy === "id"}
                                                 direction={
                                                   customSortBy === "id" ? customOrder : "asc"
                                                 }
                                                 onClick={() => handleSort("id")}
                                               >
                                               Sr No.
                                               </TableSortLabel>
                                             </TableCell>
                                             

                                            
                      ${headers
                        .map(
                          (header) => `
                       <TableCell
                                               sortDirection={
                                                 customSortBy === "${header.small_case}" ? customOrder : false
                                               }
                                             >
                                               <TableSortLabel
                                                 active={customSortBy === "${header.small_case}"}
                                                 direction={
                                                   customSortBy === "${header.small_case}" ? customOrder : "asc"
                                                 }
                                                 onClick={() => handleSort("${header.small_case}")}
                                               >
                                                ${header.pascalName}
                                               </TableSortLabel>
                                             </TableCell>
                       
                          `
                        )
                        .join("")}
                         <TableCell
                                               sortDirection={
                                                 customSortBy === "is_active" ? customOrder : false
                                               }
                                             >
                                               <TableSortLabel
                                                 active={customSortBy === "is_active"}
                                                 direction={
                                                   customSortBy === "is_active" ? customOrder : "asc"
                                                 }
                                                 onClick={() => handleSort("is_active")}
                                               >
                                               Status
                                               </TableSortLabel>
                                             </TableCell>
                                             <TableCell>
                                               Used/UnUsed
                                             </TableCell>
                      <TableCell>
                        <Typography variant="h6">Actions</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="table-body">
                      {(provided) => (
                        <TableBody
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {pageLoading ? (
                                                     <TableRow>
                                                       <TableCell colSpan={15} align="center">
                                                         <Box
                                                           display="flex"
                                                           justifyContent="center"
                                                           py={3}
                                                         >
                                                           <CircularProgress size={32} />
                                                         </Box>
                                                       </TableCell>
                                                     </TableRow>
                                                   ) : filteredRows.length > 0 ? (
                            filteredRows.map((row, indx) => (
                            <Draggable
                              key={row.id.toString()}
                              draggableId={row.id.toString()}
                              index={indx}
                            >
                              {(provided, snapshot) => (
                                <TableRow
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    background: snapshot.isDragging
                                      ? "#f5f5f5"
                                      : "inherit",
                                  }}
                                >
                                  <TableCell>
                                    <Typography variant="subtitle2">
                                      {indx + 1}
                                    </Typography>
                                  </TableCell>

                                

                                  ${tableCells}


                                     <TableCell>
                                                                     <MenuItem onClick={() => onStatus(row.id)}>
                                                                       <Box
                                                                         sx={{
                                                                           backgroundColor: row.is_active
                                                                             ? (theme) =>
                                                                                 theme.palette.success.main
                                                                             : (theme) =>
                                                                                 theme.palette.error.main,
                                                                           borderRadius: "100%",
                                                                           height: "10px",
                                                                           width: "10px",
                                                                         }}
                                                                       />
                                                                       <Typography
                                                                         color="textSecondary"
                                                                         variant="subtitle2"
                                                                         sx={{
                                                                           ml: 1,
                                                                         }}
                                                                       >
                                                                         {row.is_active ? "Active" : "Suspended"}
                                                                       </Typography>
                                                                     </MenuItem>
                                                                   </TableCell>
                                                                     <TableCell> 
                                                                       <StatusBadge  label={row.is_used ? "used" : "Unused"} />
                                                                     </TableCell>

<TableCell>
                                    <IconButton
                                      aria-label="more"
                                      id={\`long-button-/\${row.id}\`}
                                      aria-controls={
                                        open ? \`long-menu-/\${row.id}\` : undefined
                                      }
                                      aria-expanded={open ? "true" : undefined}
                                      aria-haspopup="true"
                                      onClick={(e) =>
                                        handleMenuClick(e, row.id)
                                      }
                                    >
                                      <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                      id={\`long-menu-/\${row.id}\`}
                                      anchorEl={anchorEl}
                                      open={openRowId === row.id}
                                      onClose={handleMenuClose}
                                      PaperProps={{
                                        style: {
                                          maxHeight: 48 * 4.5,
                                          width: "20ch",
                                        },
                                      }}
                                    >
                                      <MenuItem
                                        onClick={() => {
                                          handleMenuClose();
                                          router.push(${
                                            isChildPage
                                              ? `\`/apps/${moduleName
                                                  .toLowerCase()
                                                  .replaceAll(
                                                    "_",
                                                    "-"
                                                  )}/${mainTable
                                                  .toLowerCase()
                                                  .replaceAll(
                                                    "_",
                                                    "-"
                                                  )}/\${module.mainServiceId}/${tableName
                                                  .toLowerCase()
                                                  .replaceAll(
                                                    "_",
                                                    "-"
                                                  )}/\${row.id}\``
                                              : `\`/apps/${moduleName
                                                  .toLowerCase()
                                                  .replaceAll(
                                                    "_",
                                                    "-"
                                                  )}/${tableName
                                                  .toLowerCase()
                                                  .replaceAll(
                                                    "_",
                                                    "-"
                                                  )}/\${row.id}\``
                                          }
                                            
                                          );
                                        }}
                                      >
                                        <ListItemIcon>
                                          <IconEdit width={18} />
                                        </ListItemIcon>
                                        Edit
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() => {
                                          handleMenuClose();
                                          handleDelete(row.id);
                                        }}
                                      >
                                        <ListItemIcon>
                                          <IconTrash width={18} />
                                        </ListItemIcon>
                                        Delete
                                      </MenuItem>
                                    </Menu>
                                  </TableCell>

 


                                </TableRow>
                              )}
                            </Draggable>
                          ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  alignItems="center"
                                  py={3}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    color="textSecondary"
                                  >
                                    No records found
                                  </Typography>
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    sx={{ mt: 1 }}
                                    onClick={() => {
                                      setSearchText("");
                                      setStatusFilter("all");
                                    }}
                                  >
                                    Reset Filters
                                  </Button>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                          {provided.placeholder}

                          {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                              <TableCell colSpan={${
                                visibleFields.length + 3
                              }} />
                            </TableRow>
                          )}
                        </TableBody>
                      )}
                    </Droppable>
                  </DragDropContext>
                </Table>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      component="div"
                      count={customTotalRecordObj?.totalRecords}
                      page={customPage}
                      onPageChange={(_, newPage) => customSetPage(newPage)}
                      rowsPerPage={customRowsPerPage}
                      onRowsPerPageChange={(e) => {
                        customSetRowsPerPage(parseInt(e.target.value, 10));
                        customSetPage(0);
                      }}
                      rowsPerPageOptions={[5, 10, 20, 50]}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </TableContainer>
            </BlankCard>
          </ParentCard>
        </PageContainer>
      </Box>

      <Dialog
        open={deleteopen}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {process.env.NEXT_PUBLIC_REACT_APP_DELETE_CONFIRMATION}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {process.env.NEXT_PUBLIC_REACT_APP_DELETE_MSG}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseDelete}>
            No
          </Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default List;
`;
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Generated list.tsx for ${moduleName}/${tableName}`);
  } else {
    console.log(`⏭️ Skipped ${filePath} (already exists)`);
  }
}
