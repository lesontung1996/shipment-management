"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAssignments, useUpdateShipment } from "@/hooks/use-shipment-queries";
import { fromDatetimeLocal, toDatetimeLocal } from "@/lib/format";
import type { Shipment, ShipmentStatus } from "@/types/shipments";
import { getStatusOptions } from "@/types/shipments";
import { AssignmentCombobox } from "@/components/assignments/assignments-list/assignment-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormState = {
  delivery_by_date: string;
  lat: string;
  lng: string;
  status: ShipmentStatus;
  assignment_id: string;
};

function toFormState(shipment: Shipment): FormState {
  return {
    delivery_by_date: toDatetimeLocal(shipment.delivery_by_date),
    lat: String(shipment.lat),
    lng: String(shipment.lng),
    status: shipment.status,
    assignment_id: shipment.assignment_id ?? "",
  };
}

type ShipmentDetailFormProps = {
  shipment: Shipment;
};

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  OPEN: "Open",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
};

export function ShipmentDetailForm({ shipment }: ShipmentDetailFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(shipment));
  const updateShipment = useUpdateShipment();
  const assignmentsQuery = useAssignments();

  const baseline = useMemo(() => toFormState(shipment), [shipment]);
  const isDirty =
    form.delivery_by_date !== baseline.delivery_by_date ||
    form.lat !== baseline.lat ||
    form.lng !== baseline.lng ||
    form.status !== baseline.status ||
    form.assignment_id !== baseline.assignment_id;

  const lat = Number(form.lat);
  const lng = Number(form.lng);
  const dateMs = new Date(form.delivery_by_date).getTime();
  const latError =
    form.lat.trim() === "" || !Number.isFinite(lat) || lat < -90 || lat > 90
      ? "Latitude must be a number between -90 and 90."
      : undefined;
  const lngError =
    form.lng.trim() === "" || !Number.isFinite(lng) || lng < -180 || lng > 180
      ? "Longitude must be a number between -180 and 180."
      : undefined;
  const dateError =
    !form.delivery_by_date || Number.isNaN(dateMs)
      ? "Delivery-by date is required."
      : undefined;

  const needsAssignment = form.status === "IN_TRANSIT";
  const assignmentError =
    needsAssignment && !form.assignment_id
      ? "An assignment is required to move to In Transit."
      : undefined;

  const isValid = !latError && !lngError && !dateError && !assignmentError;

  const statusOptions = getStatusOptions(shipment.status);

  function handleStatusChange(next: ShipmentStatus) {
    setForm((current) => {
      const cleared =
        next === "OPEN" || next === "DELIVERED"
          ? { assignment_id: "" }
          : {};
      return { ...current, ...cleared, status: next };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    const statusChanged = form.status !== shipment.status;
    const update: Parameters<typeof updateShipment.mutate>[0]["update"] = {
      delivery_by_date: fromDatetimeLocal(form.delivery_by_date),
      lat,
      lng,
    };

    if (statusChanged) {
      update.status = form.status;
      if (form.status === "IN_TRANSIT") {
        update.assignment_id = form.assignment_id || null;
      } else if (form.status === "OPEN" || form.status === "DELIVERED") {
        update.assignment_id = null;
      }
    }

    updateShipment.mutate({ id: shipment.id, update });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FieldGroup>
        <Field>
          <FieldLabel>Status</FieldLabel>
          <Select
            value={form.status}
            onValueChange={(v) => handleStatusChange(v as ShipmentStatus)}
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
              assignments={assignmentsQuery.data ?? []}
              value={form.assignment_id}
              onValueChange={(assignmentId) =>
                setForm((current) => ({
                  ...current,
                  assignment_id: assignmentId,
                }))
              }
              invalid={Boolean(assignmentError)}
              disabled={assignmentsQuery.isLoading}
            />
            <FieldError>{assignmentError}</FieldError>
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="delivery_by_date">Delivery by</FieldLabel>
          <Input
            id="delivery_by_date"
            type="datetime-local"
            value={form.delivery_by_date}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                delivery_by_date: event.target.value,
              }))
            }
            aria-invalid={Boolean(dateError)}
          />
          <FieldError>{dateError}</FieldError>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <FieldLabel htmlFor="lat">Latitude</FieldLabel>
            <Input
              id="lat"
              type="text"
              inputMode="decimal"
              value={form.lat}
              onChange={(event) =>
                setForm((current) => ({ ...current, lat: event.target.value }))
              }
              aria-invalid={Boolean(latError)}
            />
            <FieldError>{latError}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="lng">Longitude</FieldLabel>
            <Input
              id="lng"
              type="text"
              inputMode="decimal"
              value={form.lng}
              onChange={(event) =>
                setForm((current) => ({ ...current, lng: event.target.value }))
              }
              aria-invalid={Boolean(lngError)}
            />
            <FieldError>{lngError}</FieldError>
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
        <Button type="submit" disabled={!isDirty || !isValid || updateShipment.isPending}>
          {updateShipment.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </form>
  );
}
