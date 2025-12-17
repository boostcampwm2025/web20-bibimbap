import type { PropsWithChildren, ReactNode } from "react";

type SlotSectionProps = PropsWithChildren<{
  title: string;
  action?: ReactNode;
}>;

export function SlotSection({ title, action, children }: SlotSectionProps) {
  return (
    <section className="w-full max-w-5xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {action}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

type SlotListProps = PropsWithChildren;

export function SlotList({ children }: SlotListProps) {
  return <div className="space-y-3">{children}</div>;
}

