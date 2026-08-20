"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Assignment } from "@/types/shipments";

type AssignmentRowProps = {
  assignment: Assignment;
  className?: string;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

export function AssignmentRow({
  assignment,
  className,
  selected = false,
  onSelect,
}: AssignmentRowProps) {
  const shipmentCountText = `${assignment.shipment_count} ${assignment.shipment_count === 1 ? "shipment" : "shipments"}`;

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium leading-none">{assignment.label}</p>
            <Badge variant="outline">{assignment.status}</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {assignment.id} · {shipmentCountText}
          </p>
        </div>
      </div>
    </>
  );

  if (!onSelect) {
    return (
      <div className={cn("flex w-full flex-col gap-1.5 py-0.5 text-left", className)}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(assignment.id)}
      aria-pressed={selected}
      className={cn(
        "flex h-full w-full flex-col justify-center gap-1.5 px-3 py-2 text-left transition-colors",
        "hover:bg-muted/70 focus-visible:bg-muted/70 focus-visible:outline-none",
        selected && "bg-muted",
        className
      )}
    >
      {content}
    </button>
  );
}
