import CabinCard from "./CabinCard";
import * as cabinServices from "@/app/_lib/data-service";
// import { unstable_noStore as noStore } from "next/cache";

interface CabinProps {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
}

type FilterProp = "all" | "small" | "medium" | "large";

export default async function CabinList({ filter }: { filter: FilterProp }) {
  // noStore();
  const cabins: CabinProps[] = await cabinServices.getCabins();

  if (!cabins || !cabins.length) {
    return null;
  }

  let displayedCabins: CabinProps[] = [];
  if (filter === "all") {
    displayedCabins = cabins;
  }
  if (filter === "small") {
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  }

  if (filter === "medium") {
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity < 8
    );
  }

  if (filter === "large") {
    displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin: CabinProps) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
