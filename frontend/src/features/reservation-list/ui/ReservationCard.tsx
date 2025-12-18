import { useNavigate } from 'react-router-dom';
import type { Reservation } from '../types/reservation.types';
import { formatDateRange } from '../../../utils/formatDate';
import Badge from '../../../components/Badge';
import Tag from '../../../components/Tag';
import {
  STATUS_LABELS,
  PLATFORM_LABELS,
} from '../../../utils/reservationConstants';
import { ICONS } from '../../../constants/icons.constants';

interface ReservationCardProps {
  reservation: Reservation;
}

function ReservationCard({ reservation }: ReservationCardProps) {
  const navigate = useNavigate();
  const statusLabel = STATUS_LABELS[reservation.status];
  const platformLabel = PLATFORM_LABELS[reservation.platform];
  const dateRange = formatDateRange(reservation.startDate, reservation.endDate);

  const handleClick = () => {
    navigate(`/event/${reservation.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-card-bg border border-border-main rounded-lg p-lg mb-md transition-shadow duration-200 hover:shadow-md cursor-pointer"
    >
      <div className="flex justify-between items-start mb-md">
        <h3 className="flex-1 mr-md my-0 text-lg font-semibold text-text-primary">
          {reservation.title}
        </h3>
        <div className="flex gap-sm items-center flex-shrink-0">
          <Badge label={statusLabel} variant={reservation.status} />
          <Tag label={platformLabel} variant={reservation.platform} />
        </div>
      </div>
      <p className="my-0 mb-md text-md text-text-secondary leading-relaxed">
        {reservation.description}
      </p>
      <div className="flex items-center justify-start">
        <span className="text-sm text-text-secondary">
          {ICONS.CLOCK} {dateRange}
        </span>
      </div>
    </div>
  );
}

export default ReservationCard;
