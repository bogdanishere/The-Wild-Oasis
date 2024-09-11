import { Metadata } from "next";
import { auth } from "../_lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Accounts",
};

export default async function Page() {
  const session = await auth();

  if (!session || !session?.user || !session?.user?.email) {
    redirect("/login");
    return null;
  }
  const firstName = session?.user?.name?.split(" ")?.[0] ?? "";
  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {firstName}
    </h2>
  );
}
