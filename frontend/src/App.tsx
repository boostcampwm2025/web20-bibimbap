import { Toaster } from "sonner";
import { CreateEventPage } from "./features/create-event/ui/CreateEventPage";

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <CreateEventPage />
    </>
  );
}

export default App;
