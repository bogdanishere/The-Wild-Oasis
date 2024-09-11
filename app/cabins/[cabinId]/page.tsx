import * as cabinServices from "@/app/_lib/data-service";
import Reservation from "@/app/_components/Reservation";
import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner";
import Cabin from "@/app/_components/Cabin";

interface ParamsProps {
  cabinId: string;
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

// change the page to static from dynamic page
export async function generateStaticParams() {
  const cabins = await cabinServices.getCabins();

  const ids = cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));

  return ids;
}

export async function generateMetadata({ params }: { params: ParamsProps }) {
  const cabin: CabinProps = await cabinServices.getCabin(+params.cabinId);
  const { name } = cabin;

  return {
    title: `Cabin ${name}`,
  };
}

export default async function Page({ params }: { params: ParamsProps }) {
  const cabin: CabinProps = await cabinServices.getCabin(+params.cabinId);
  const { name } = cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin} />
      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {name} today. Pay on arrival.
        </h2>
        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
