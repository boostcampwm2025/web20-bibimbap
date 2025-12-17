type SlotCardVariant = "selected" | "available" | "disabled" | "confirmed";

type SlotCardProps = {
  dateLabel: string;
  timeLabel: string;
  reviewer: string;
  location?: string;
  rightLabel: string;
  variant?: SlotCardVariant;
  onClick?: () => void;
};

export function SlotCard({
  dateLabel,
  timeLabel,
  reviewer,
  location,
  rightLabel,
  variant = "available",
  onClick,
}: SlotCardProps) {
  const styles = getVariantStyles(variant);

  const isInteractive =
    onClick && variant !== "disabled" && variant !== "confirmed";

  return (
    <article
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={[
        "flex items-center justify-between rounded-md border px-5 py-4 shadow-sm transition",
        isInteractive
          ? "cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          : "",
        styles.container,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className={styles.iconWrapper}>📅</div>
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-sm text-gray-900">
            <span>{dateLabel}</span>
            <span className="text-gray-500">•</span>
            <span className="flex items-center gap-1">
              <ClockIcon />
              {timeLabel}
            </span>
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-medium">{`시니어 리뷰어: ${reviewer}`}</span>
          </div>
          {location ? (
            <div className="text-xs text-gray-500">{location}</div>
          ) : null}
        </div>
      </div>

      <div className="text-sm font-medium" aria-label="slot-capacity">
        <span className={styles.rightLabel}>{rightLabel}</span>
      </div>
    </article>
  );
}

function getVariantStyles(variant: SlotCardVariant) {
  switch (variant) {
    case "selected":
      return {
        container: "border-green-300 bg-green-50",
        iconWrapper: "text-green-700",
        rightLabel: "text-green-800",
      };
    case "disabled":
      return {
        container: "border-gray-200 bg-gray-50 opacity-70",
        iconWrapper: "text-gray-500",
        rightLabel: "text-gray-500",
      };
    case "confirmed":
      return {
        container: "border-blue-300 bg-blue-50",
        iconWrapper: "text-blue-700",
        rightLabel: "text-blue-800",
      };
    default:
      return {
        container: "border-gray-200 bg-white",
        iconWrapper: "text-gray-700",
        rightLabel: "text-gray-800",
      };
  }
}

function ClockIcon() {
  return (
    <span
      aria-hidden
      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-600"
    >
      ⏰
    </span>
  );
}
