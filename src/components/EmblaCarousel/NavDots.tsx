import clsx from "clsx";
import { BasicProps } from "./types";

export default function NavDots({ slidesCount, activeIndex, emblaApi }: BasicProps) {
  return (
    <div className="w-full flex gap-3 items-center justify-center">
      {
        new Array(slidesCount).fill(0).map((slide, index) =>
          <button
            onClick={() => {
              emblaApi?.scrollTo(index);
            }}
            className={clsx({
              "w-[12px] h-[3px] rounded-lg transition-all": true,
              "bg-black": index === activeIndex,
              "bg-gray-300": index !== activeIndex
            })}
            type='button'
            key={index}
          ></button>
        )
      }
    </div>
  );
}