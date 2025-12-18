import { Toaster } from "sonner";
import { ReservationList } from "./features/reservation-list";
import "./features/reservation-list/styles.css";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <ReservationList />
    </>
  );
}

export default App;
