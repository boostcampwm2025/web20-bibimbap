type ReservationStatusBannerProps = {
  statusTitle: string;
  statusDetail?: string;
  actionLabel?: string;
  onActionClick?: () => void;
};

export function ReservationStatusBanner({
  statusTitle,
  statusDetail,
  actionLabel,
  onActionClick,
}: ReservationStatusBannerProps) {
  return (
    <section className="w-full max-w-5xl rounded-md border border-green-100 bg-green-50 px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <SuccessIcon />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-green-900">{statusTitle}</p>
            {statusDetail ? (
              <p className="text-sm text-green-800">{statusDetail}</p>
            ) : null}
          </div>
        </div>

        {actionLabel ? (
          <button
            type="button"
            className="rounded-md border border-green-200 bg-white px-3 py-1.5 text-sm font-medium text-green-900 shadow-sm hover:bg-green-100"
            onClick={onActionClick}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}

function SuccessIcon() {
  return (
    <span
      aria-hidden
      className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700"
    >
      ✓
    </span>
  );
}

