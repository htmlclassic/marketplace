'use client';

import clsx from "clsx";
import { useState } from "react";
import EmblaCarousel from "./EmblaCarousel";

import {
  Dialog,
  DialogContent,
} from "@/src/components/ui/dialog"

interface CarouselProps {
  children: React.ReactNode | React.ReactNode[];
}

export default function Carousel({ children: chld }: CarouselProps) {
  const children = Array.isArray(chld) ? chld : [ chld ];
  const [activeElementIndex, setActiveElementIndex] = useState(0);
  const [showDetailedPicture, setShowPreview] = useState(false);

  const handleClick = (index: number) => setActiveElementIndex(index);

  return (
    <div>
      <div className="relative aspect-square sm:hidden">
        <EmblaCarousel
          slides={children}
          options={{
            loop: true,
            hideNavigationArrows: true
          }}
        />
      </div>
      <div className="gap-5 hidden sm:flex">
        <Dialog open={showDetailedPicture} onOpenChange={open => setShowPreview(open)}>
          <DialogContent className="overflow-hidden landscape:w-[95vh] portrait:w-[95vw] max-h-none max-w-none border-white border-2 aspect-square p-0 focus:outline-none">
            { children[activeElementIndex] }
          </DialogContent>
        </Dialog>
        {
          children.length !== 1 && 
          <div className="flex flex-col gap-2 h-[80vw] sm:h-[500px] overflow-y-auto no-scrollbar shrink-0">
            {
              children.map((element, index) => {
                const isActive = activeElementIndex === index;

                return (
                  <div
                    key={index}
                    onClick={() => handleClick(index)}
                    className={clsx({
                      'w-[120px] h-[120px] border-[4px] shrink-0 cursor-pointer relative flex justify-center items-center rounded-lg overflow-hidden': true,
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
        <div
          onClick={() => setShowPreview(true)}
          className="w-full h-[500px] relative flex justify-center items-center rounded-lg overflow-hidden cursor-pointer"
        >
          { children[activeElementIndex] }
        </div>
      </div>
    </div>
  );
}