

"use client";

import React from "react";
import Link from "next/link";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LabelWithTooltipProps {
  text?: string;
  tooltip?: string;
  href?: string;
}

const LabelWithTooltip: React.FC<LabelWithTooltipProps> = ({
  text,
  tooltip,
  href,
}) => {
  return (
    <span className="inline-flex items-center gap-1">
      {text}

      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>

            <TooltipContent className="max-w-xs text-sm">
              {href ? (
                <span>
                  {tooltip}{" "}
                  <Link
                    href={href}
                    target="_blank"
                    className="font-medium underline"
                  >
                    Learn more
                  </Link>
                </span>
              ) : (
                tooltip
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </span>
  );
};

export default LabelWithTooltip;