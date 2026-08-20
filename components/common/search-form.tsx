"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchFormProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
};

export function SearchForm({
  value,
  onChange,
  placeholder = "Search…",
  "aria-label": ariaLabel = "Search",
}: SearchFormProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pl-8"
      />
    </div>
  );
}
