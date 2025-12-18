import type { ReservationStatus } from '../features/reservation-list/types/reservation.types';

interface BadgeProps {
  label: string;
  variant: ReservationStatus;
}

function Badge({ label, variant }: BadgeProps) {
  const variantStyles = {
    progress: 'bg-status-progress',
    scheduled: 'bg-status-scheduled',
    ended: 'bg-status-ended',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-md text-sm font-medium text-white text-center ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}

export default Badge;
