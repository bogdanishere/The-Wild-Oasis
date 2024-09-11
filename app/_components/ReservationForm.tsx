"use client";

import { useReservation } from "../_context/ReservationContext";
import { differenceInDays } from "date-fns";
import { createBookingAction } from "../_lib/action";
import SubmitButton from "./SubmitButton";

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

function ReservationForm({
  cabin,
  user,
}: {
  cabin: CabinProps;
  user: { name: string; image: string; email: string };
}) {
  const { maxCapacity, regularPrice, discount } = cabin;
  const { range, resetRange } = useReservation() as {
    range: { from: Date; to: Date };
    resetRange: () => void;
  };

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate, startDate);

  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: cabin.id,
  };

  // @ts-ignore
  const createBookingWithData = createBookingAction.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center relative">
          <img
            referrerPolicy="no-referrer"
            className="h-8 rounded-full object-cover"
            src={user.image}
            alt={user.name}
          />
        </div>
        <p>{user.name}</p>
      </div>

      <form
        // action={createBookingWithData}
        action={async (formData) => {
          await createBookingWithData(formData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!startDate && !endDate ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel="Reserving...">Reserve Now</SubmitButton>
          )}

          <p>
            {String(range.from)} --- {String(range.to)}
          </p>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
