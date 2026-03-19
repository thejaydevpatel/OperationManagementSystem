import { Badge } from "../components/ui/badge";

interface StatusBadgeProps {
  label: "Used" | "Unused" | "used" | "unused";
}

export function StatusBadge({ label }: StatusBadgeProps) {
  const isUsed = label.toLowerCase() === "used";

  return (
    <Badge
      variant={isUsed ? "default" : "secondary"}
      className={
        isUsed
          ? "bg-green-100 text-green-700 hover:bg-green-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
      }
    >
      {label}
    </Badge>
  );
}