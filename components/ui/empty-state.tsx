import Link from "next/link"
import { ReactNode } from "react"
import { Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  buttonText?: string
  buttonHref?: string
  onAction?: () => void
  icon?: ReactNode
}

export default function EmptyState({
  title = "No results found",
  description = "There is no data available.",
  buttonText,
  buttonHref,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-muted-foreground">
        {icon ?? <Inbox className="h-10 w-10 mx-auto" />}
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {description}
      </p>

      {buttonText && buttonHref && (
        <Link href={buttonHref}>
          <Button className="mt-4">
            {buttonText}
          </Button>
        </Link>
      )}

      {buttonText && !buttonHref && onAction && (
        <Button className="mt-4" onClick={onAction}>
          {buttonText}
        </Button>
      )}
    </div>
  )
}