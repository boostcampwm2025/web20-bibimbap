type PageHeaderProps = {
  brandLabel: string;
  actionLabel?: string;
  onActionClick?: () => void;
};

export function PageHeader({
  brandLabel,
  actionLabel,
  onActionClick,
}: PageHeaderProps) {
  return (
    <header className="flex w-full max-w-5xl items-center justify-between">
      <div className="text-lg font-semibold text-sky-700">{brandLabel}</div>
      {actionLabel ? (
        <button
          type="button"
          className="text-sm font-medium text-sky-700 hover:text-sky-800"
          onClick={onActionClick}
        >
          {actionLabel}
        </button>
      ) : (
        <div className="h-6" />
      )}
    </header>
  );
}
