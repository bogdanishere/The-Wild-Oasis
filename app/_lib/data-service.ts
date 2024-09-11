import { eachDayOfInterval } from "date-fns";

import { supabase } from "./supabase";
import { notFound } from "next/navigation";

interface GuestProp {
  fullName: string;
  email: string;
  nationality: string;
  nationalID: string;
  countryFlag: string;
}

interface BookingProp {
  status: "unconfirmed" | "checked-in" | "checked-out";
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  hasBreakfast: boolean;
  observations: string;
  isPaid: boolean;
  guests: {
    fullName: string;
    email: string;
    country: string;
    countryFlag: string;
    nationalID: string;
  };
  cabins: {
    name: string;
  };
}

/////////////
// GET

export async function getCabin(id: number) {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getCabinIdFromBookings(id: number) {
  const { data, error } = await supabase
    .from("bookings")
    .select("cabinId")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export async function getCabinPrice(id: number) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id: number) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

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

// export async function getBookings(guestId: number): Promise<BookingProps[]> {
//   const { data, error, count } = await supabase
//     .from("bookings")
//     // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
//     .select(
//       "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestsId, cabinId, cabins(name, image)"
//     )
//     .eq("guestsId", guestId)
//     .order("startDate");

//   if (error) {
//     console.error(error);
//     throw new Error(`Bookings could not get loaded ${error.message}`);
//   }

//   return data || [];
// }

export async function getBookings(guestId: number): Promise<BookingProps[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestsId, cabinId, cabins(name, image)"
    )
    .eq("guestsId", guestId)
    .order("startDate")
    .returns<BookingProps[]>(); // Adaugă tipul returnat explicit

  if (error) {
    console.error(error);
    throw new Error(`Bookings could not get loaded ${error.message}`);
  }

  return data || [];
}

// export async function getBookedDatesByCabinId(cabinId: number) {
//   let today = new Date();
//   today.setUTCHours(0, 0, 0, 0);
//   today = today.toISOString();

//   // Getting all bookings
//   const { data, error } = await supabase
//     .from("bookings")
//     .select("*")
//     .eq("cabinId", cabinId)
//     .or(`startDate.gte.${today},status.eq.checked-in`);

//   if (error) {
//     console.error(error);
//     throw new Error("Bookings could not get loaded");
//   }

//   // Converting to actual dates to be displayed in the date picker
//   const bookedDates = data
//     .map((booking) => {
//       return eachDayOfInterval({
//         start: new Date(booking.startDate),
//         end: new Date(booking.endDate),
//       });
//     })
//     .flat();

//   return bookedDates;
// }

// export async function getBookedDatesByCabinId(cabinId: number) {
//   let today = new Date();
//   today.setUTCHours(0, 0, 0, 0);
//   today = new Date(today.toISOString());

//   // Getting all bookings
//   const { data, error } = await supabase
//     .from("bookings")
//     .select("*")
//     .eq("cabinId", cabinId)
//     .or(`startDate.gte.${today},status.eq.checked-in`);

//   if (error) {
//     console.error(error);
//     throw new Error("Bookings could not get loaded");
//   }

//   // Converting to actual dates to be displayed in the date picker
//   const bookedDates = data
//     .map((booking) => {
//       return eachDayOfInterval({
//         start: new Date(booking.startDate), // Convertește string-ul ISO în Date
//         end: new Date(booking.endDate), // Convertește string-ul ISO în Date
//       });
//     })
//     .flat();

//   return bookedDates;
// }

export async function getBookedDatesByCabinId(cabinId: number) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayString = today.toISOString();

  // Getting all bookings with the fixed .or() clause
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId);
  // .or(`startDate.gte.${todayString},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Filter based on the status or startDate being equal to today
  const bookedDates1 = data.map((booking) => {
    return (
      new Date(booking.startDate).toISOString() === todayString ||
      booking.status === "checked-in"
    );
  });

  if (!data) return [];

  // Map bookings to the date range
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest: GuestProp[]) {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(newBooking: BookingProp) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

// /////////////
// // UPDATE

// // The updatedFields is an object which should ONLY contain the updated data
// export async function updateGuest(id: number, updatedFields: GuestProp) {
//   const { data, error } = await supabase
//     .from("guests")
//     .update(updatedFields)
//     .eq("id", id)
//     .select()
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error("Guest could not be updated");
//   }
//   return data;
// }

// export async function updateBooking(id: number, updatedFields: BookingProp) {
//   const { data, error } = await supabase
//     .from("bookings")
//     .update(updatedFields)
//     .eq("id", id)
//     .select()
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error("Booking could not be updated");
//   }
//   return data;
// }

// /////////////
// // DELETE

// export async function deleteBooking(id: number) {
//   const { data, error } = await supabase.from("bookings").delete().eq("id", id);

//   if (error) {
//     console.error(error);
//     throw new Error("Booking could not be deleted");
//   }
//   return data;
// }
