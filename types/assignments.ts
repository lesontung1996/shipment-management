export const ASSIGNMENT_STATUSES = ["OPEN", "COMPLETED"] as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export type Assignment = {
  id: string;
  label: string;
  status: AssignmentStatus;
  clients: string[];
  shipment_count: number;
};
