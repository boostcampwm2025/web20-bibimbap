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
};

export function ReservationFooter({
  primaryLabel,
  onPrimaryClick,
  primaryDisabled,
}: ReservationFooterProps) {
  return (
    <footer className="w-full max-w-5xl rounded-md px-6 py-4">
      <div className="flex justify-end">
        <PrimaryButton
          label={primaryLabel}
          onClick={onPrimaryClick}
          disabled={primaryDisabled}
        />
      </div>
    </footer>
  );
}
