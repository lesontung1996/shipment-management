"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type ShipmentSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ShipmentSearch({ value, onChange }: ShipmentSearchProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by label or client"
        aria-label="Search shipments by label or client name"
        className="pl-8"
      />
    </div>
  );
}
