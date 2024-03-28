import MainLoadingSpinner from "@/src/components/MainLoadingSpinner";

export default function Loading() {
  return (
    <div className="grow h-full flex justify-center items-center">
      <MainLoadingSpinner />
    </div>
  );
}