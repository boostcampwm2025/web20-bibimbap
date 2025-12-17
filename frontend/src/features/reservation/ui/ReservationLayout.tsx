import type { PropsWithChildren } from "react";

export function ReservationLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      {children}
    </div>
  );
}
