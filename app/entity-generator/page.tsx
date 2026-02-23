"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type FieldType = {
  name: string;
  type: string;
  size?: string;
  nullable: boolean;
  primaryKey: boolean;
  identity: boolean;
  defaultValue: string;
  constraints: string;
  system?: boolean;
  foreignKey?: boolean;
  refTable?: string;
  refColumn?: string;
  onDeleteCascade?: boolean;
  onUpdateCascade?: boolean;
  toShowOnLayout?: boolean;
  specificControl: string;
};

const defaultField: FieldType = {
  name: "",
  type: "VARCHAR",
  size: "",
  nullable: false,
  primaryKey: false,
  identity: false,
  defaultValue: "",
  constraints: "",
  foreignKey: false,
  refTable: "",
  refColumn: "",
  onDeleteCascade: false,
  onUpdateCascade: false,
  toShowOnLayout: true,
  specificControl: "",
};

const systemFields: FieldType[] = [
  {
    name: "is_used",
    type: "BOOLEAN",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "false",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "is_deleted",
    type: "BOOLEAN",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "false",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "is_active",
    type: "BOOLEAN",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "false",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "created_at",
    type: "TIMESTAMP WITH TIME ZONE",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "updated_at",
    type: "TIMESTAMP WITH TIME ZONE",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "created_by",
    type: "TEXT",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "updated_by",
    type: "TEXT",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "host_ip",
    type: "TEXT",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "url",
    type: "TEXT",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "deleted_at",
    type: "TIMESTAMP WITH TIME ZONE",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "deleted_by",
    type: "TEXT",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "tenant_id",
    type: "UUID",
    nullable: true,
    primaryKey: false,
    identity: false,
    defaultValue: "",
    constraints: "",
    system: true,
    foreignKey: true, // NEW
    refTable: "tenants", // NEW
    refColumn: "tenant_id", // NEW
    onDeleteCascade: false, // you can set true if needed
    onUpdateCascade: false, // you can set true if needed
    toShowOnLayout: false,
    specificControl: "",
  },
  {
    name: "id",
    type: "INTEGER",
    nullable: false,
    primaryKey: true,
    identity: true, // will generate auto-increment in SQL
    defaultValue: "",
    constraints: "",
    system: true,
    toShowOnLayout: false,
    specificControl: "",
  },
];

export default function EntityForm() {
  const [dbName, setDbName] = useState("ecommerce_master");
  const [moduleName, setModuleName] = useState("");
  const [isSchemaOnly, setIsSchemaOnly] = useState(false);
  const [tableName, setTableName] = useState("");
  const [fields, setFields] = useState<FieldType[]>([
    ...systemFields,
    { ...defaultField },
  ]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [isChildPage, setIsChildPage] = useState(false);
  const [mainTable, setMainTable] = useState("");

  const [mainId, setMainId] = useState("");

  const updateField = <K extends keyof FieldType>(
    index: number,
    key: K,
    value: FieldType[K]
  ) => {
    setFields((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const addField = () => {
    setFields([...fields, { ...defaultField }]);
  };

  const removeField = (index: number) => {
    if (fields[index].system) return;
    setFields(fields.filter((_, i) => i !== index));
  };

const validateBeforeGenerate = () => {
  // Main fields validation
  if (!dbName.trim() || !tableName.trim() || !moduleName.trim()) {
    toast.error(
      "Please enter all details, database name, table name and module name."
    );
    return false;
  }

  // Field name validation
  if (!fields.every((f) => f.name.trim())) {
    toast.error("Name field is required.");
    return false;
  }

  return true; 
};
const handleGenerateClick = () => {
  if (!validateBeforeGenerate()) return;
  setOpenConfirm(true);
};
  
const handleSubmit = async () => {
  try {
    const res = await fetch("/api/entity-generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dbName,
        moduleName,
        tableName,
        fields,
        isSchemaOnly,
        isChildPage,
        mainTable,
        mainId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Something went wrong");
      return;
    }

    toast.success(data.message || "Entity generated successfully!");
  } catch (error) {
  console.error("Entity generation failed:", error);
  toast.error("Server error occurred");
}
};


  return (
  
    <div className="sm:max-w-6xl mx-auto">

      <Card className="mt-14">
        <CardHeader>
          <CardTitle className="text-2xl">Create Entity</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="" >

            <div className="flex flex-wrap gap-4">

              <Input
                placeholder="Database Name"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
                className="w-48"
              />

              <Input
                placeholder="Module Name"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                className="w-48"
              />

              <Input
                placeholder="Table Name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="w-48"
              />
              <br />
              
            </div>
              <div className="flex items-center gap-8 mt-4 bg-muted/40 p-3">
              <div className="flex items-center p-3 gap-3">
                {/* Schema Only */}
                  <Checkbox
                    checked={isSchemaOnly}
                    onCheckedChange={(checked) =>
                      setIsSchemaOnly(checked as boolean)
                    }
                  />
                  <Label>Schema Only</Label>
              </div>

                {/* Is Child Page */}
              <div className="flex items-center p-3 gap-3">
                <Checkbox
                  checked={isChildPage}
                  onCheckedChange={(checked) =>
                    setIsChildPage(checked as boolean)
                  }
                />
                <Label>Is Child Page</Label>
              </div>
              <div className="flex items-center p-3 gap-3" >
                {isChildPage && (
                  <>
                    <Input 
                      placeholder="Folder Name (example: tours, dummy-v1)"
                      value={mainTable}
                      onChange={(e) => setMainTable(e.target.value)}
                      className="w-64"
                    />

                    <Input
                      placeholder="Main id column (camelCase)"
                      value={mainId}
                      onChange={(e) => setMainId(e.target.value)}
                      className="w-56"
                      />
                  </>
                )}
              </div>
            </div>

          </div>
        </CardContent>
      </Card>


       <div className="mt-14 sm:max-w-6xl mx-auto">
        <Table className="mt-5">
          <TableHeader>
            <TableRow className=" mt-20 bg-muted border-b border-border">
              <TableHead>Name</TableHead>
              <TableHead>Specific Control</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Size</TableHead>
              <TableHead>Nullable</TableHead>
              <TableHead>Primary Key</TableHead>
              <TableHead>Identity</TableHead>
              <TableHead>Default Value</TableHead>
              <TableHead>Constraints</TableHead>
              <TableHead>FK?</TableHead>
              <TableHead>Ref Table</TableHead>
              <TableHead>Ref Column</TableHead>
              <TableHead>Del Cascade</TableHead>
              <TableHead>Upd Cascade</TableHead>
              <TableHead>Layout?</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fields.map((f, idx) => (
            <TableRow key={idx} >
              <TableCell>
                <input
                     className="bg-white border-2 border-primary/40 focus-visible:ring-primary shadow-sm"
                      value={f.name}
                      onChange={(e) => updateField(idx, "name", e.target.value)}
                      disabled={f.system}
                />
              </TableCell>
              <TableCell>
                <select
                      value={f.specificControl}
                      onChange={(e) =>
                        updateField(idx, "specificControl", e.target.value)
                      }
                      disabled={f.system}
                    >
                      <option value="Default">Default</option>
                      <option value="DropDown">Auto Complete DropDown</option>
                      <option value="NormalDropDown">Normal DropDown</option>
                      <option value="CustomDate">Custom Date</option>
                      <option value="Radio">Radio</option>
                      <option value="MultiCheckbox">MultiCheckbox</option>
                      <option value="RichTextPicker">RichText Picker</option>
                      <option value="File">File</option>
                    </select>
              </TableCell>
              <TableCell>
                <select
                      value={f.type}
                      onChange={(e) => updateField(idx, "type", e.target.value)}
                      disabled={f.system}
                    >
                      <option value="VARCHAR">VARCHAR</option>
                      <option value="INTEGER">INTEGER</option>
                      <option value="DECIMAL">DECIMAL</option>
                      <option value="BIGINT">BIGINT</option>
                      <option value="BOOLEAN">BOOLEAN</option>
                      <option value="TEXT">TEXT</option>
                      <option value="UUID">UUID</option>
                      <option value="TIMESTAMP WITH TIME ZONE">
                        TIMESTAMP WITH TIME ZONE
                      </option>
                      <option value="TIME">TIME</option>
                      <option value="POLYGON">POLYGON</option>
                      {/* Bit Strings */}
                      <option value="BIT">BIT</option>
                      <option value="BIT VARYING">BIT VARYING</option>

                      {/* Binary Data */}
                      <option value="BYTEA">BYTEA</option>
                    </select>
              </TableCell>
              <TableCell>
                {f.type === "VARCHAR" && (
                      <input
                        //  className="bg-white border w-20 text-center border-primary/50"
                        className="bg-white border-2 border-primary/40 w-20 focus-visible:ring-primary shadow-sm"
                        value={f.size || ""}
                        onChange={(e) => updateField(idx, "size", e.target.value)}
                        disabled={f.system}
                        // style={{ width: "60px" }}
                      />
                    )}
              </TableCell>
              <TableCell className="mx-auto text-center w-48">
                <input 
                      type="checkbox"
                      checked={f.nullable}
                      onChange={(e) =>
                        updateField(idx, "nullable", e.target.checked)
                      }
                      disabled={f.system}
                    />
              </TableCell>
              <TableCell className="mx-auto text-center w-48">
                <input
                      type="radio"
                      checked={f.primaryKey}
                      name="primaryKey"
                      onChange={() => {
                        const updated = fields.map((ff, i) => ({
                          ...ff,
                          primaryKey: i === idx,
                        }));
                        setFields(updated);
                      }}
                      disabled={f.system}
                    />
              </TableCell>
              <TableCell className="mx-auto text-center w-48">
                <input
                      type="checkbox"
                      checked={f.identity}
                      onChange={(e) =>
                        updateField(idx, "identity", e.target.checked)
                      }
                      disabled={f.system}
                    />
              </TableCell>
              <TableCell>
                <input        
                      className="bg-white border-2 border-primary/40 focus-visible:ring-primary shadow-sm"
                      value={f.defaultValue}
                      onChange={(e) =>
                        updateField(idx, "defaultValue", e.target.value)
                      }
                      disabled={f.system}
                    />
              </TableCell>
              <TableCell>
                <input
                      value={f.constraints}
                      placeholder="e.g., UNIQUE, CHECK (age > 0)"
                      onChange={(e) =>
                        updateField(idx, "constraints", e.target.value)
                      }
                      disabled={f.system}
                    />
              </TableCell>
              <TableCell className="mx-auto text-center w-48">
                <input
                      type="checkbox"
                      checked={!!f.foreignKey}
                      onChange={(e) =>
                        updateField(idx, "foreignKey", e.target.checked)
                      }
                      disabled={f.system}
                    />
              </TableCell>
              <TableCell>
                {f.foreignKey && (
                      <input
                        value={f.refTable || ""}
                        onChange={(e) =>
                          updateField(idx, "refTable", e.target.value)
                        }
                      />
                    )}
              </TableCell>
              <TableCell>
                {f.foreignKey && (
                      <input
                        value={f.refColumn || ""}
                        onChange={(e) =>
                          updateField(idx, "refColumn", e.target.value)
                        }
                      />
                    )}
              </TableCell>
              <TableCell className="mx-auto text-center w-48">
                {f.foreignKey && (
                      <input
                        type="checkbox"
                        checked={!!f.onDeleteCascade}
                        onChange={(e) =>
                          updateField(idx, "onDeleteCascade", e.target.checked)
                        }
                      />
                    )}
              </TableCell>
              <TableCell className="mx-auto text-center w-48">
                {f.foreignKey && (
                      <input
                        type="checkbox"
                        checked={!!f.onUpdateCascade}
                        onChange={(e) =>
                          updateField(idx, "onUpdateCascade", e.target.checked)
                        }
                      />
                    )}
              </TableCell>
              <TableCell className="mx-auto text-center w-48">
                <input
                      type="checkbox"
                      checked={!!f.toShowOnLayout}
                      onChange={(e) =>
                        updateField(idx, "toShowOnLayout", e.target.checked)
                      }
                    />
              </TableCell>
              <TableCell>
                {!f.system && (
                      <button onClick={() => removeField(idx)}>Delete</button>
                    )}
              </TableCell>
            </TableRow>
            ))}
          </TableBody> 
        </Table>
      </div>

      <div className="mt-14 flex justify-center gap-4 p-4" >
        <Button onClick={addField} className="mt-10">
          + Add Column
        </Button>
        {/* <Button onClick={handleSubmit}  className="cursor-pointer">
          Generate
        </Button> */}
        <Button onClick={handleGenerateClick}>
          Generate
        </Button>
          <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will generate entity for table <strong>{tableName}</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => {
                    setOpenConfirm(false); // close dialog first
                    handleSubmit();        // then call API
                  }}
                >
                 Generate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </div>

    </div>
  );
}
