import { Suspense } from "react";
import { AssignmentManagementPage } from "@/components/assignments/assignment-management-page";

export default function AssignmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="grid h-full place-items-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AssignmentManagementPage />
    </Suspense>
  );
}
