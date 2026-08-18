"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useShipmentForm } from "@/hooks/use-shipment-form";
import { useUpdateShipment } from "@/hooks/use-shipment-queries";
import type { Shipment, ShipmentStatus, ShipmentUpdate } from "@/types/shipments";
import { AssignmentCombobox } from "@/components/assignments/assignments-list/assignment-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ShipmentDetailFormProps = {
  shipment: Shipment;
};

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  OPEN: "Open",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
};

export function ShipmentDetailForm({ shipment }: ShipmentDetailFormProps) {
  const updateShipment = useUpdateShipment();
  const {
    form,
    errors,
    canSubmit,
    needsAssignment,
    statusOptions,
    assignments,
    isAssignmentsLoading,
    setField,
    setStatus,
    handleSubmit,
  } = useShipmentForm({
    shipment,
    onSubmit: (values) => {
      const statusChanged = values.status !== shipment.status;
      const update: ShipmentUpdate = {
        delivery_by_date: values.delivery_by_date,
        lat: values.lat,
        lng: values.lng,
      };

      if (statusChanged) {
        update.status = values.status;
        update.assignment_id = values.assignment_id;
      }

      updateShipment.mutate({ id: shipment.id, update });
    },
  });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FieldGroup>
        <Field>
          <FieldLabel>Status</FieldLabel>
          <Select
            value={form.status}
            onValueChange={(v) => setStatus(v as ShipmentStatus)}
            disabled={statusOptions.length <= 1}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {needsAssignment && (
          <Field>
            <FieldLabel>Assignment</FieldLabel>
            <AssignmentCombobox
              assignments={assignments}
              value={form.assignment_id}
              onValueChange={(assignmentId) =>
                setField("assignment_id", assignmentId)
              }
              invalid={Boolean(errors.assignment_id)}
              disabled={isAssignmentsLoading}
            />
            <FieldError>{errors.assignment_id}</FieldError>
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="delivery_by_date">Delivery by</FieldLabel>
          <Input
            id="delivery_by_date"
            type="datetime-local"
            value={form.delivery_by_date}
            onChange={(event) =>
              setField("delivery_by_date", event.target.value)
            }
            aria-invalid={Boolean(errors.delivery_by_date)}
          />
          <FieldError>{errors.delivery_by_date}</FieldError>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="lat">Latitude</FieldLabel>
            <Input
              id="lat"
              type="text"
              inputMode="decimal"
              value={form.lat}
              onChange={(event) => setField("lat", event.target.value)}
              aria-invalid={Boolean(errors.lat)}
            />
            <FieldError>{errors.lat}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="lng">Longitude</FieldLabel>
            <Input
              id="lng"
              type="text"
              inputMode="decimal"
              value={form.lng}
              onChange={(event) => setField("lng", event.target.value)}
              aria-invalid={Boolean(errors.lng)}
            />
            <FieldError>{errors.lng}</FieldError>
          </Field>
        </div>
      </FieldGroup>
      <Separator />
      <div className="flex flex-col gap-2">
        {updateShipment.isError ? (
          <p className="text-sm text-destructive">
            Could not save changes. Try again.
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={!canSubmit || updateShipment.isPending}
        >
          {updateShipment.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
