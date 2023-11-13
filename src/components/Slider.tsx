'use client';

import clsx from "clsx";
import { useState } from "react";

interface SliderProps {
  children: React.ReactNode | React.ReactNode[];
}

export default function Slider({ children: chld }: SliderProps) {
  const children = Array.isArray(chld) ? chld : [ chld ];
  const [activeElementIndex, setActiveElementIndex] = useState(0);

  const handleClick = (index: number) => setActiveElementIndex(index);

  return (
    <div className="flex flex-col gap-5 items-center sm:items-start max-w-[1000px]">
      <div className="w-[80vw] h-[80vw] sm:w-[400px] sm:h-[400px] borer-2 border-red-400 relative flex justify-center items-center rounded-lg overflow-hidden">
        { children[activeElementIndex] }
      </div>
      {
        children.length !== 1 && 
        <div className="w-full gap-2 grid grid-cols-[repeat(auto-fit,100px)] justify-center sm:justify-normal">
          {
            children.map((element, index) => {
              const isActive = activeElementIndex === index;

              return (
                <div
                  key={index}
                  onClick={() => handleClick(index)}
                  className={clsx({
                    'w-[100px] h-[100px] border-[3px] shrink-0 cursor-pointer relative flex justify-center items-center rounded-lg overflow-hidden': true,
                    'border-sky-400': isActive,
                    'border-transparent': !isActive
                  })}
                >
                  {element}
                </div>
              );
            })
          }
        </div>
      }
    </div>
  );
}