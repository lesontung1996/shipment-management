"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteShipmentQuery } from "@/hooks/use-shipment-queries";
import { useShipmentStore } from "@/stores/shipment-store";
import type { Shipment } from "@/types/shipments";

type DeleteShipmentDialogProps = {
  shipment: Shipment;
  disabled?: boolean;
};

export function DeleteShipmentDialog({
  shipment,
  disabled,
}: DeleteShipmentDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteShipment = useDeleteShipmentQuery();

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (deleteShipment.isPending) return;
        if (!nextOpen) deleteShipment.reset();
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            disabled={disabled || deleteShipment.isPending}
          />
        }
      >
        Delete
      </DialogTrigger>
      <DialogContent showCloseButton={!deleteShipment.isPending}>
        <DialogHeader>
          <DialogTitle>Delete shipment</DialogTitle>
          <DialogDescription>
            This will permanently delete {shipment.label}. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {deleteShipment.isError ? (
            <p className="text-sm text-destructive sm:mr-auto">
              Could not delete shipment. Try again.
            </p>
          ) : null}
          <Button
            type="button"
            variant="outline"
            disabled={deleteShipment.isPending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteShipment.isPending}
            onClick={() =>
              deleteShipment.mutate(shipment.id, {
                onSuccess: () => {
                  const { selectedShipmentId, setSelectedShipmentId } =
                    useShipmentStore.getState();
                  if (selectedShipmentId === shipment.id) {
                    setSelectedShipmentId(null);
                  }
                  setOpen(false);
                },
              })
            }
          >
            {deleteShipment.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
