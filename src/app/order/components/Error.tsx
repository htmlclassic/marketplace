import type { FieldError } from "react-hook-form";

interface Props {
  error: FieldError | undefined;
}

export default function Error({ error }: Props) {
  if (!error) return null;

  return (
    <div className="text-sm text-red-400">
      {error.message}
    </div>
  );
}