"use client";

import { useState } from "react";
import { ShipmentForm } from "@/components/shipments/shipments-detail/shipment-form";
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

const FORM_ID = "new-shipment-form";

export function NewShipmentDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>New shipment</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New shipment</DialogTitle>
          <DialogDescription>
            Fill in the shipment details. Status starts as Open unless you assign
            a route.
          </DialogDescription>
        </DialogHeader>
        <ShipmentForm
          key={String(open)}
          formId={FORM_ID}
          idPrefix="new-shipment"
          onSuccess={() => setOpen(false)}
          renderActions={({ canSubmit, isPending, isError }) => (
            <DialogFooter>
              {isError ? (
                <p className="text-sm text-destructive sm:mr-auto">
                  Could not create shipment. Try again.
                </p>
              ) : null}
              <Button
                type="submit"
                form={FORM_ID}
                disabled={!canSubmit || isPending}
              >
                {isPending ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          )}
        />
      </DialogContent>
    </Dialog>
  );
}
