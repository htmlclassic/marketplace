import MainLoadingSpinner from "../components/MainLoadingSpinner";

export default function Loading() {
  return (
    <div className="grow flex justify-center items-center">
      <MainLoadingSpinner />
    </div>
  )
}