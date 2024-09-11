// "use client";

// import {
//   differenceInDays,
//   isPast,
//   isSameDay,
//   isWithinInterval,
// } from "date-fns";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";
// import { useReservation } from "../_context/ReservationContext";

// function isAlreadyBooked(
//   range: { from: Date | null; to: Date | null },
//   datesArr: Date[]
// ) {
//   return (
//     range.from !== null &&
//     range.to !== null &&
//     datesArr.some((date) =>
//       isWithinInterval(date, { start: range.from!, end: range.to! })
//     )
//   );
// }

// interface SettingsProp {
//   id: number;
//   createdAt: string;
//   minBookingLength: number;
//   maxBookingLength: number;
//   maxGuestsPerBooking: number;
//   BreakfastPrice: number;
// }

// interface BookedDatesProp {
//   id: number;
//   created_at: string;
//   startDate: string;
//   endDate: string;
//   numNights: number;
//   numGuests: number;
//   cabinPrice: number;
//   extrasPrice: number;
//   totalPrice: number;
//   status: "unconfirmed" | "checked-in" | "checked-out" | "canceled"; // Possible statuses
//   hasBreakfast: boolean;
//   isPaid: boolean;
//   observations: string;
//   cabinId: number;
//   guestsId: number;
// }

// interface CabinProps {
//   id: number;
//   name: string;
//   maxCapacity: number;
//   regularPrice: number;
//   discount: number;
//   image: string;
//   description: string;
//   created_at: string;
// }

// function DateSelector({
//   settings,
//   bookedDates,
//   cabin,
// }: {
//   settings: SettingsProp;
//   bookedDates: Date[];
//   cabin: CabinProps;
// }) {
//   interface RangeProp {
//     from: Date | null;
//     to: Date | null;
//   }
//   const { range, setRange, resetRange } = useReservation() as {
//     range: RangeProp;
//     setRange: (range: RangeProp) => void;
//     resetRange: () => void;
//   };
//   console.log(range);

//   const { regularPrice, discount } = cabin;

//   const { minBookingLength, maxBookingLength } = settings;

//   const numNights =
//     range.from && range.to ? differenceInDays(range.to, range.from) : 0;
//   const cabinPrice = (regularPrice - discount) * numNights;

//   const displayRange = isAlreadyBooked(range, bookedDates)
//     ? { from: null, to: null }
//     : range;

//   return (
//     <div className="flex flex-col justify-between ">
//       <DayPicker
//         className="pt-12 place-self-center px-12"
//         mode="range"
//         selected={displayRange}
//         onSelect={(range: RangeProp) => setRange(range)}
//         fromMonth={new Date()}
//         fromDate={new Date()}
//         toYear={new Date().getFullYear() + 5}
//         min={minBookingLength + 1}
//         max={maxBookingLength}
//         captionLayout="dropdown"
//         numberOfMonths={2}
//         disabled={(curDate) =>
//           isPast(curDate) ||
//           bookedDates.some((date) => isSameDay(date, curDate))
//         }
//       />

//       <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
//         <div className="flex items-baseline gap-6">
//           <p className="flex gap-2 items-baseline">
//             {discount > 0 ? (
//               <>
//                 <span className="text-2xl">${regularPrice - discount}</span>
//                 <span className="line-through font-semibold text-primary-700">
//                   ${regularPrice}
//                 </span>
//               </>
//             ) : (
//               <span className="text-2xl">${regularPrice}</span>
//             )}
//             <span className="">/night</span>
//           </p>
//           {numNights ? (
//             <>
//               <p className="bg-accent-600 px-3 py-2 text-2xl">
//                 <span>&times;</span> <span>{numNights}</span>
//               </p>
//               <p>
//                 <span className="text-lg font-bold uppercase">Total</span>{" "}
//                 <span className="text-2xl font-semibold">${cabinPrice}</span>
//               </p>
//             </>
//           ) : null}
//         </div>

//         {range.from || range.to ? (
//           <button
//             className="border border-primary-800 py-2 px-4 text-sm font-semibold"
//             onClick={() => resetRange()}
//           >
//             Clear
//           </button>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// export default DateSelector;

"use client";

import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DayPicker, DateRange, Modifiers } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "../_context/ReservationContext";

function isAlreadyBooked(
  range: { from: Date | undefined; to: Date | undefined },
  datesArr: Date[]
) {
  return (
    range.from !== undefined &&
    range.to !== undefined &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from!, end: range.to! })
    )
  );
}

interface SettingsProp {
  id: number;
  createdAt: string;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  BreakfastPrice: number;
}

interface BookedDatesProp {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
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

interface RangeProp {
  from: Date | undefined;
  to: Date | undefined;
}

function DateSelector({
  settings,
  bookedDates,
  cabin,
}: {
  settings: SettingsProp;
  bookedDates: Date[];
  cabin: CabinProps;
}) {
  const { range, setRange, resetRange } = useReservation() as {
    range: RangeProp;
    setRange: (range: RangeProp) => void;
    resetRange: () => void;
  };

  const { regularPrice, discount } = cabin;
  const { minBookingLength, maxBookingLength } = settings;

  const numNights =
    range.from && range.to ? differenceInDays(range.to, range.from) : 0;
  const cabinPrice = (regularPrice - discount) * numNights;

  const displayRange = isAlreadyBooked(range, bookedDates)
    ? { from: undefined, to: undefined }
    : range;

  const handleSelect = (
    selected: DateRange | undefined,
    triggerDate: Date,
    modifiers: Modifiers,
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) => {
    if (selected) {
      setRange({ from: selected.from, to: selected.to });
    } else {
      setRange({ from: undefined, to: undefined });
    }
  };

  return (
    <div className="flex flex-col justify-between ">
      <DayPicker
        className="pt-12 place-self-center px-12"
        mode="range"
        selected={displayRange}
        onSelect={handleSelect} // Use the updated handler
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        min={minBookingLength + 1}
        max={maxBookingLength}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range.from || range.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={() => resetRange()}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
