import { ReservationList } from './features/reservation-list';
import { CreateEventPage } from './features/create-event/ui/CreateEventPage';
import './features/reservation-list/styles.css';

function App() {
  // TODO: 라우팅 추가 필요 - 임시로 ReservationList만 렌더링
  return <ReservationList />;
import { Toaster } from "sonner";
import { CreateEventPage } from "./features/create-event/ui/CreateEventPage";
import ReservationPage from "./features/reservation/ui/ReservationPage";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <CreateEventPage />
      <ReservationPage />
    </>
  );
}

export default App;
