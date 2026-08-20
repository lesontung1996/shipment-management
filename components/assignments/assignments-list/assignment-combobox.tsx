"use client";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { AssignmentRow } from "@/components/assignments/assignments-list/assignment-row";
import type { Assignment } from "@/types/assignments";

type AssignmentComboboxProps = {
  assignments: Assignment[];
  value: string;
  onValueChange: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

function assignmentSearchLabel(assignment: Assignment) {
  return [
    assignment.label,
    assignment.id,
    assignment.status,
  ].join(" ");
}

export function AssignmentCombobox({
  assignments,
  value,
  onValueChange,
  invalid,
  disabled,
  placeholder = "Select assignment...",
}: AssignmentComboboxProps) {
  const selected =
    assignments.find((assignment) => assignment.id === value) ?? null;

  return (
    <Combobox
      items={assignments}
      value={selected}
      onValueChange={(assignment) =>
        onValueChange(assignment ? assignment.id : "")
      }
      itemToStringLabel={assignmentSearchLabel}
      itemToStringValue={(assignment) => assignment.id}
      isItemEqualToValue={(a, b) => a.id === b.id}
      disabled={disabled}
      autoHighlight
    >
      <ComboboxTrigger
        render={
          <Button
            variant="outline"
            className="h-auto w-full min-h-8 justify-between py-2 font-normal"
            aria-invalid={invalid}
          />
        }
      >
        {selected ? (
          <AssignmentRow assignment={selected} />
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </ComboboxTrigger>
      <ComboboxContent className="w-(--anchor-width)">
        <ComboboxInput showTrigger={false} placeholder="Search assignments..." />
        <ComboboxEmpty>No assignment found.</ComboboxEmpty>
        <ComboboxList>
          {(assignment) => (
            <ComboboxItem
              key={assignment.id}
              value={assignment}
              className="h-auto items-start py-2"
            >
              <AssignmentRow assignment={assignment} />
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
