"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

import * as services from "./data-service";
import { redirect } from "next/navigation";

export async function updateProfileAction(data: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be signed in to update your profile");
  }

  const nationalID = data.get("nationalID") as string;
  const nationalityRaw = data.get("nationality") as string;

  if (!nationalityRaw) {
    throw new Error("Nationality is required");
  }

  const [nationality, countryFlag] = nationalityRaw.split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Please provide a valid national ID");
  }

  const updateData = {
    nationality,
    countryFlag,
    nationalID,
  };

  const { data: data2, error } = await supabase
    .from("guests")
    .update(updateData)
    // @ts-ignore
    .eq("id", session.user.guestId)
    .select()
    .single();

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile"); // Revalidate the profile page
}

export async function signInAction() {
  await signIn("google", {
    redirectTo: "/account",
  });
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}

export async function deleteReservationAction(bookingId: number) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be signed in to update your profile");
  }

  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  //@ts-expect-error
  console.log("bookingId", bookingId);

  // @ts-ignore
  const guestBookings = await services.getBookings(session.user.guestId);
  // @ts-ignore
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  console.log("guestBookingIds", guestBookingIds);

  // console.log("guestBookings", guestBookings);

  console.log("problem", guestBookingIds.includes(bookingId));

  // if (!guestBookingIds.includes(bookingId)) {
  //   throw new Error("You are not authorized to delete this booking");
  // }

  if (error) {
    throw new Error("You are not allowed to delete this booking");
  }
  revalidatePath("/account/reservations"); // Revalidate the reservations page
}

export async function editReservationAction(data: FormData) {
  const session = await auth();

  if (!session) {
    throw new Error("You must be signed in to update your profile");
  }

  const reservationId = data.get("reservationId") as string;

  // const guestBookings = await services.getBookings(session.user.guestId);
  // // @ts-ignore
  // const guestBookingIds = guestBookings.map((booking) => booking.id);

  // console.log("problem", guestBookingIds.includes(+reservationId));

  // if (!guestBookingIds.includes(+reservationId)) {
  //   throw new Error("You are not authorized to delete this booking");
  // }

  const numGuests = data.get("numGuests") as string;
  const observations = data.get("observations") as string;

  if (observations.length > 200) {
    throw new Error("Observations are too long");
  }

  if (!numGuests) {
    throw new Error("Number of guests is required");
  }
  const dataToUpdate = {
    numGuests: Number(numGuests),
    observations,
  };

  const { error } = await supabase
    .from("bookings")
    .update(dataToUpdate)
    .eq("id", reservationId)
    .eq("guestsId", session.user.guestId)
    .select()
    .single();

  if (error) {
    throw new Error("Reservation could not be updated");
  }

  revalidatePath("/account/reservations");
  revalidatePath("/account/reservations/edit/" + reservationId);

  redirect("/account/reservations");
}

interface BookingData {
  startDate: string;
  endDate: string;
  numNights: number;
  cabinPrice: number;
  cabinId: number;
}

export async function createBookingAction(
  bookingData: BookingData,
  data: FormData
) {
  const session = await auth();

  if (!session) {
    throw new Error("You must be signed in to update your profile");
  }

  const newBooking = {
    ...bookingData,
    guestsId: session.user.guestId,
    numGuests: Number(data.get("numGuests")),
    observations: data.get("observations")?.slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    status: "unconfirmed",
    isPaid: false,
    hasBreakfast: false,
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    throw new Error("Reservation could not be created");
  }

  revalidatePath("/cabins/" + bookingData.cabinId);
  redirect("/cabins/thankyou");
}
