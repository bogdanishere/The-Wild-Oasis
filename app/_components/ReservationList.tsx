"use client";

import { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { deleteReservationAction } from "../_lib/action";

interface BookingProps {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestsId: number;
  cabinId: number;
  cabins: {
    name: string;
    image: string;
  };
}

export default function ReservationList({
  bookings,
}: {
  bookings: BookingProps[];
}) {
  const [optimisticBookings, optimisticDelete] = useOptimistic<
    BookingProps[],
    unknown
  >(bookings, (curBookings, bookingId) => {
    return curBookings.filter((booking) => booking.id !== bookingId);
  });

  async function handleDelete(bookingId: number) {
    optimisticDelete(+bookingId);
    await deleteReservationAction(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
}
