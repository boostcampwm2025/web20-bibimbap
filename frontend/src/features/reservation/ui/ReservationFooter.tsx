type PrimaryButtonProps = {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
};

export function PrimaryButton({
  label,
  disabled,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

type ReservationFooterProps = {
  primaryLabel: string;
  onPrimaryClick?: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  secondaryDisabled?: boolean;
  leftLabel?: string;
  onLeftClick?: () => void;
  leftDisabled?: boolean;
};

export function ReservationFooter({
  primaryLabel,
  onPrimaryClick,
  primaryDisabled,
  secondaryLabel,
  onSecondaryClick,
  secondaryDisabled,
  leftLabel,
  onLeftClick,
  leftDisabled,
}: ReservationFooterProps) {
  return (
    <footer className="w-full max-w-5xl rounded-md px-6 py-4">
      <div className="flex justify-between gap-3">
        {/* 왼쪽 버튼 (이벤트 생성) */}
        {leftLabel ? (
          <button
            type="button"
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:bg-green-300"
            onClick={onLeftClick}
            disabled={leftDisabled}
          >
            {leftLabel}
          </button>
        ) : (
          <div />
        )}

        {/* 오른쪽 버튼들 */}
        <div className="flex gap-3">
          {secondaryLabel && (
            <button
              type="button"
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-300"
              onClick={onSecondaryClick}
              disabled={secondaryDisabled}
            >
              {secondaryLabel}
            </button>
          )}

          {/* 예약하기 버튼 */}
          <PrimaryButton
            label={primaryLabel}
            onClick={onPrimaryClick}
            disabled={primaryDisabled}
          />
        </div>
      </div>
    </footer>
  );
}
