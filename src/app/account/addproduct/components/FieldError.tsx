import type { FieldError } from "react-hook-form";

export default function FieldError({ error }: { error: FieldError | undefined }) {
  return (
    error &&
      <div className="text-sm text-red-400 mt-2">{error.message}</div>
  );
}