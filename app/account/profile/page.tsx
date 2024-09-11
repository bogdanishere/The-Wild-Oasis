import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import SelectCountry from "@/app/_components/SelectCountry";
import { auth } from "@/app/_lib/auth";
import * as services from "@/app/_lib/data-service";

export const metadata = {
  title: "Update your guest profile",
};

interface GuestProps {
  fullName: string;
  email: string;
  nationality: string;
  nationalID: string | null;
  countryFlag: string | null;
  image: string | null;
}

interface SessionProps {
  user: {
    email: string;
  };
}

export default async function Page() {
  // @ts-ignore
  const session: SessionProps = await auth();

  const guest: GuestProps = await services.getGuest(session.user.email);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your guest profile
      </h2>

      <p className="text-lg mb-8 text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>
      <UpdateProfileForm guest={guest}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultCountry={guest.nationality}
        />
      </UpdateProfileForm>
    </div>
  );
}
