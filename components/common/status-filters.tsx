"use client";

import { Button } from "@/components/ui/button";
import { formatStatus } from "@/lib/format";
import { cn } from "@/lib/utils";

type StatusFiltersProps<T extends string> = {
  statuses: readonly T[];
  value: T;
  onChange: (status: T) => void;
  "aria-label": string;
  className?: string;
  statusClassName?: (
    status: T,
    appearance: "solid" | "outline"
  ) => string | undefined;
};

export function StatusFilters<T extends string>({
  statuses,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
  statusClassName,
}: StatusFiltersProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("grid gap-1.5", className)}
      style={{ gridTemplateColumns: `repeat(${statuses.length}, minmax(0, 1fr))` }}
    >
      {statuses.map((status) => {
        const selected = status === value;
        return (
          <Button
            key={status}
            type="button"
            size="sm"
            variant="outline"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(status)}
            className={cn(
              "px-1.5 text-[0.7rem] capitalize",
              statusClassName?.(status, selected ? "solid" : "outline")
            )}
          >
            {formatStatus(status).toLowerCase()}
          </Button>
        );
      })}
    </div>
  );
}
