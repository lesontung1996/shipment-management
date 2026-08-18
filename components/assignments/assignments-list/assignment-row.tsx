import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Assignment } from "@/types/shipments";

type AssignmentRowProps = {
  assignment: Assignment;
  className?: string;
};

export function AssignmentRow({
  assignment,
  className,
}: AssignmentRowProps) {
  const shipmentCountText = `${assignment.shipment_count} ${assignment.shipment_count === 1 ? "shipment" : "shipments"}`;
  return (
    <div className={cn("flex w-full flex-col gap-1.5 py-0.5 text-left", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium leading-none">{assignment.label}</p>
            <Badge variant="outline">
              {assignment.status}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{assignment.id} · {shipmentCountText}</p>
        </div>
      </div>
    </div>
  );
}
