import { auth } from "../_lib/auth";
import DateSelector from "./DateSelector";
import LoginMessage from "./LoginMessage";
import ReservationForm from "./ReservationForm";
import * as cabinServices from "@/app/_lib/data-service";

interface CabinProps {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description: string;
  created_at: string;
}

interface BookedDatesProp {
  id: number;
  created_at: string; // Date string in ISO format
  startDate: string; // Date string
  endDate: string; // Date string
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: "unconfirmed" | "checked-in" | "checked-out" | "canceled"; // Possible statuses
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string;
  cabinId: number;
  guestsId: number;
}

export default async function Reservation({ cabin }: { cabin: CabinProps }) {
  const [settings, bookedDates] = await Promise.all([
    cabinServices.getSettings(),
    cabinServices.getBookedDatesByCabinId(cabin.id),
  ]);

  const session = await auth();

  //   console.log("settings", settings);
  //   console.log("bookedDates", bookedDates);
  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        cabin={cabin}
        settings={settings}
        bookedDates={bookedDates}
      />
      {session?.user ? (
        <ReservationForm
          cabin={cabin}
          user={session.user as { name: string; image: string; email: string }}
        />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}
