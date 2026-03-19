"use client"

import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import Link from "next/link"

interface LabelWithTooltipProps {
  text: string
  tooltip: string
  href?: string
}

export function LabelWithTooltip({
  text,
  tooltip,
  href,
}: LabelWithTooltipProps) {
  return (
    <div className="flex items-center gap-2">
      {text && <Label>{text}</Label>}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button">
              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </button>
          </TooltipTrigger>

          <TooltipContent className="max-w-xs text-sm">
            <p>{tooltip}</p>

            {href && (
              <Link
                href={href}
                className="block mt-2 text-primary underline"
              >
                Learn more
              </Link>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}