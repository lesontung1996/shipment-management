"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

type StatusGroupShellProps = {
  statusLabel: string;
  count: ReactNode;
  badgeClassName?: string;
  isPending?: boolean;
  isError?: boolean;
  errorMessage?: string;
  isEmpty?: boolean;
  emptyTitle: string;
  emptyDescription: string;
  children?: ReactNode;
};

export function StatusGroupShell({
  statusLabel,
  count,
  badgeClassName,
  isPending,
  isError,
  errorMessage,
  isEmpty,
  emptyTitle,
  emptyDescription,
  children,
}: StatusGroupShellProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex w-full shrink-0 items-center gap-2 px-3 py-2">
        <span className="text-sm font-medium capitalize">{statusLabel}</span>
        <Badge variant="secondary" className={badgeClassName}>
          {count}
        </Badge>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {isPending ? (
          <div className="flex flex-col gap-2 px-3 py-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="px-3 py-2 text-sm text-destructive">{errorMessage}</p>
        ) : isEmpty ? (
          <Empty className="border-0 py-4">
            <EmptyHeader>
              <EmptyTitle>{emptyTitle}</EmptyTitle>
              <EmptyDescription>{emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
