import { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import FilterPlaceholder from './FilterPlaceholder';
import ReservationCard from './ReservationCard';
import { fetchReservations } from '../api/reservations.api';
import type { Reservation } from '../types/reservation.types';
import { MESSAGES } from '../../../constants/messages.constants';
import { filterReservations } from '../model/filters';

function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true);
        const data = await fetchReservations();
        setReservations(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : MESSAGES.FETCH_ERROR);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const filteredReservations = filterReservations(
    reservations,
    searchQuery,
    filterQuery,
  );

  return (
    <div className="min-h-screen bg-bg-main text-text-primary">
      <PageHeader title="bookstcamp 10기 멤버십" />
      <FilterPlaceholder
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterQuery={filterQuery}
        onFilterChange={setFilterQuery}
      />
      <div className="p-lg max-w-[1200px] mx-auto">
        {loading && (
          <div className="text-center py-8">
            <p>{MESSAGES.LOADING}</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredReservations.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}

        {!loading && !error && filteredReservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
    </div>
  );
}

export default ReservationList;
