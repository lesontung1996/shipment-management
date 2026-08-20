import { Suspense } from "react";
import { ShipmentManagementPage } from "@/components/shipments/shipment-management-page";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="grid h-svh place-items-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <ShipmentManagementPage />
    </Suspense>
  );
}
