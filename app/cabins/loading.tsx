import SpinnerMini from "../_components/SpinnerMini";

export default function Loading() {
  return (
    <div className="grid items-center justify-center gap-5">
      <SpinnerMini />
      <p className="text-xl text-primary-200">Loading cabin data...</p>
    </div>
  );
}
