"use client";

import type { ReactNode } from "react";
import { Controller } from "react-hook-form";
import { AssignmentCombobox } from "@/components/assignments/assignments-list/assignment-combobox";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  isShipmentUpdateField,
  toShipmentUpdate,
  useShipmentForm,
  type ShipmentFormValues,
} from "@/hooks/use-shipment-form";
import {
  useCreateShipmentQuery,
  useUpdateShipmentQuery,
} from "@/hooks/use-shipment-queries";
import {
  STATUS_LABELS,
  type Shipment,
  type ShipmentCreate,
  type ShipmentStatus,
} from "@/types/shipments";

type ShipmentFormActions = {
  canSubmit: boolean;
  isPending: boolean;
  isError: boolean;
};

export type ShipmentFormProps = {
  formId?: string;
  idPrefix?: string;
  shipment?: Shipment;
  onSuccess?: (shipment: Shipment) => void;
  renderActions?: (actions: ShipmentFormActions) => ReactNode;
};

function createShipmentId() {
  return `shp_${crypto.randomUUID().replaceAll("-", "").slice(0, 8)}`;
}

function fieldId(prefix: string | undefined, name: string) {
  return prefix ? `${prefix}-${name}` : name;
}

function isEditable(isUpdate: boolean, field: keyof ShipmentFormValues) {
  return !isUpdate || isShipmentUpdateField(field);
}

export function ShipmentForm({
  formId,
  idPrefix,
  shipment,
  onSuccess,
  renderActions,
}: ShipmentFormProps) {
  const isUpdate = Boolean(shipment);
  const createShipment = useCreateShipmentQuery();
  const updateShipment = useUpdateShipmentQuery();
  const resolvedFormId =
    formId ?? (isUpdate ? "update-shipment-form" : "create-shipment-form");

  const {
    form,
    canSubmit,
    needsAssignment,
    statusOptions,
    assignments,
    isAssignmentsLoading,
    setStatus,
    handleSubmit,
  } = useShipmentForm({
    shipment,
    onSubmit: (values) => {
      if (!shipment) {
        const body: ShipmentCreate = {
          id: createShipmentId(),
          ...values,
          eta: values.delivery_by_date,
        };
        createShipment.mutate(body, { onSuccess });
        return;
      }

      updateShipment.mutate({
        id: shipment.id,
        update: toShipmentUpdate(values, shipment),
      });
    },
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;
  const isPending = isUpdate
    ? updateShipment.isPending
    : createShipment.isPending;
  const isError = isUpdate ? updateShipment.isError : createShipment.isError;
  const actions: ShipmentFormActions = { canSubmit, isPending, isError };

  return (
    <>
      <form
        id={resolvedFormId}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field data-invalid={Boolean(errors.client_name)}>
              <FieldLabel htmlFor={fieldId(idPrefix, "client_name")}>
                Client
              </FieldLabel>
              <Input
                id={fieldId(idPrefix, "client_name")}
                disabled={!isEditable(isUpdate, "client_name")}
                aria-invalid={Boolean(errors.client_name)}
                {...register("client_name")}
              />
              <FieldError errors={[errors.client_name]} />
            </Field>

            <Field data-invalid={Boolean(errors.label)}>
              <FieldLabel htmlFor={fieldId(idPrefix, "label")}>Label</FieldLabel>
              <Input
                id={fieldId(idPrefix, "label")}
                disabled={!isEditable(isUpdate, "label")}
                aria-invalid={Boolean(errors.label)}
                {...register("label")}
              />
              <FieldError errors={[errors.label]} />
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) =>
                      setStatus(value as ShipmentStatus)
                    }
                    disabled={
                      !isEditable(isUpdate, "status") || statusOptions.length <= 1
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field data-invalid={Boolean(errors.arrival_date)}>
              <FieldLabel htmlFor={fieldId(idPrefix, "arrival_date")}>
                Arrival date
              </FieldLabel>
              <Input
                id={fieldId(idPrefix, "arrival_date")}
                type="datetime-local"
                disabled={!isEditable(isUpdate, "arrival_date")}
                aria-invalid={Boolean(errors.arrival_date)}
                {...register("arrival_date")}
              />
              <FieldError errors={[errors.arrival_date]} />
            </Field>

            <Field data-invalid={Boolean(errors.warehouse_id)}>
              <FieldLabel htmlFor={fieldId(idPrefix, "warehouse_id")}>
                Warehouse
              </FieldLabel>
              <Input
                id={fieldId(idPrefix, "warehouse_id")}
                disabled={!isEditable(isUpdate, "warehouse_id")}
                aria-invalid={Boolean(errors.warehouse_id)}
                {...register("warehouse_id")}
              />
              <FieldError errors={[errors.warehouse_id]} />
            </Field>

            <Field data-invalid={Boolean(errors.assignment_id)}>
              <FieldLabel>Assignment</FieldLabel>
              <Controller
                name="assignment_id"
                control={control}
                render={({ field, fieldState }) => (
                  <AssignmentCombobox
                    assignments={assignments}
                    value={field.value}
                    onValueChange={field.onChange}
                    invalid={fieldState.invalid}
                    disabled={
                      isAssignmentsLoading ||
                      !isEditable(isUpdate, "assignment_id") ||
                      !needsAssignment
                    }
                    placeholder={needsAssignment ? "Select assignment..." : "—"}
                  />
                )}
              />
              <FieldError errors={[errors.assignment_id]} />
            </Field>

            <Field
              className="sm:col-span-2"
              data-invalid={Boolean(errors.delivery_by_date)}
            >
              <FieldLabel htmlFor={fieldId(idPrefix, "delivery_by_date")}>
                Delivery by
              </FieldLabel>
              <Input
                id={fieldId(idPrefix, "delivery_by_date")}
                type="datetime-local"
                disabled={!isEditable(isUpdate, "delivery_by_date")}
                aria-invalid={Boolean(errors.delivery_by_date)}
                {...register("delivery_by_date")}
              />
              <FieldError errors={[errors.delivery_by_date]} />
            </Field>

            <Field data-invalid={Boolean(errors.lat)}>
              <FieldLabel htmlFor={fieldId(idPrefix, "lat")}>
                Latitude
              </FieldLabel>
              <Input
                id={fieldId(idPrefix, "lat")}
                type="text"
                inputMode="decimal"
                disabled={!isEditable(isUpdate, "lat")}
                aria-invalid={Boolean(errors.lat)}
                {...register("lat")}
              />
              <FieldError errors={[errors.lat]} />
            </Field>

            <Field data-invalid={Boolean(errors.lng)}>
              <FieldLabel htmlFor={fieldId(idPrefix, "lng")}>
                Longitude
              </FieldLabel>
              <Input
                id={fieldId(idPrefix, "lng")}
                type="text"
                inputMode="decimal"
                disabled={!isEditable(isUpdate, "lng")}
                aria-invalid={Boolean(errors.lng)}
                {...register("lng")}
              />
              <FieldError errors={[errors.lng]} />
            </Field>
          </div>
        </FieldGroup>

        {renderActions ? null : (
          <div className="flex flex-col gap-2">
            {isError ? (
              <p className="text-sm text-destructive">
                {isUpdate
                  ? "Could not save changes. Try again."
                  : "Could not create shipment. Try again."}
              </p>
            ) : null}
            <Button type="submit" disabled={!canSubmit || isPending}>
              {isPending
                ? isUpdate
                  ? "Saving…"
                  : "Creating…"
                : isUpdate
                  ? "Save"
                  : "Create"}
            </Button>
          </div>
        )}
      </form>
      {renderActions?.(actions)}
    </>
  );
}
