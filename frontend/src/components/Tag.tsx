import type { Platform } from '../features/reservation-list/types/reservation.types';

interface TagProps {
  label: string;
  variant: Platform;
}

function Tag({ label, variant }: TagProps) {
  const variantStyles = {
    web: 'bg-platform-web',
    android: 'bg-platform-android',
    ios: 'bg-platform-ios',
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-sm text-sm font-semibold text-white text-center ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}

export default Tag;
