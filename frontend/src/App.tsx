import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CreateEventPage } from './features/create-event/ui/CreateEventPage';
import ReservationPage from './features/reservation/ui/ReservationPage';
import { ReservationList } from './features/reservation-list';
import './features/reservation-list/styles.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<ReservationList />} />
        <Route path="/event/:eventId" element={<ReservationPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
