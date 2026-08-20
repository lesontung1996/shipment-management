"use client";

import { StatusFilters } from "@/components/common/status-filters";
import {
  ASSIGNMENT_STATUSES,
  type AssignmentStatus,
} from "@/types/shipments";

type AssignmentStatusFiltersProps = {
  value: AssignmentStatus;
  onChange: (status: AssignmentStatus) => void;
};

export function AssignmentStatusFilters({
  value,
  onChange,
}: AssignmentStatusFiltersProps) {
  return (
    <StatusFilters
      statuses={ASSIGNMENT_STATUSES}
      value={value}
      onChange={onChange}
      aria-label="Filter assignments by status"
    />
  );
}
