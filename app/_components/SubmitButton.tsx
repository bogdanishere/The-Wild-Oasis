"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  pendingLabel = "Updating...",
  ...props
}: {
  children: ReactNode;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-accent-400 text-primary-900 font-semibold py-3 px-6 rounded-sm"
      disabled={pending}
      {...props}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
