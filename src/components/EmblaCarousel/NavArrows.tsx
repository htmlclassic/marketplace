import { NavArrowsProps } from "./types";

export default function NavArrows({
  emblaApi,
  slidesCount,
  activeIndex,
  loop,
  dragFree
}: NavArrowsProps) {
  return (
    <>
      <button
        onClick={() => {
          emblaApi?.scrollPrev();
        }}
        disabled={!loop && activeIndex === 0}
        className="disabled:opacity-20 disabled:cursor-default bg-gray-50 bg-opacity-50 cursor-pointer border p-3 absolute z-10 top-[50%] -translate-y-1/2 left-0">{'<'}
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        disabled={!loop && activeIndex === slidesCount - 1}
        className="disabled:opacity-20 disabled:cursor-default bg-gray-50 bg-opacity-50 cursor-pointer border p-3 absolute z-10 top-[50%] -translate-y-1/2 right-0">{'>'}
      </button>
    </>
  );
}