import { useState } from 'react';
import PageHeader from './PageHeader';
import FilterPlaceholder from './FilterPlaceholder';
import ReservationCard from './ReservationCard';
import { mockReservations } from '../model/mockData';

function ReservationList() {
  const [reservations] = useState(mockReservations);

  return (
    <div className="min-h-screen bg-bg-main text-text-primary">
      <PageHeader title="bookstcamp 10기 멤버십" />
      <FilterPlaceholder />
      <div className="p-lg max-w-[1200px] mx-auto">
        {reservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
    </div>
  );
}

export default ReservationList;
