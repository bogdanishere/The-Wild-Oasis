import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

export async function GET(
  request: Request,
  { params }: { params: { cabinid: string } }
) {
  const { cabinid } = params;
  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(+cabinid),
      getBookedDatesByCabinId(+cabinid),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch (error) {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}

// export async function POST({ body }) {
//   return {
//     status: 200,
//     body: {
//       message: `Hello from the API! You sent: ${JSON.stringify(body)}`,
//     },
//   };
// }
