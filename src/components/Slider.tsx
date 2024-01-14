'use client';

import clsx from "clsx";
import { useState } from "react";
import EmblaCarousel from "./EmblaCarousel";
import { motion } from "framer-motion";

interface SliderProps {
  children: React.ReactNode | React.ReactNode[];
}

export default function Slider({ children: chld }: SliderProps) {
  const children = Array.isArray(chld) ? chld : [ chld ];
  const [activeElementIndex, setActiveElementIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleClick = (index: number) => setActiveElementIndex(index);

  return (
    <>
      <div className="aspect-square sm:hidden">
        <EmblaCarousel
          slides={children}
          options={{
            loop: true,
            hideNavigationArrows: true
          }}
        />
      </div>
      <div className="gap-5 hidden sm:flex">
        {
          showPreview &&
            <div
              onClick={() => setShowPreview(false)}
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-30 flex justify-center items-center cursor-pointer"
            >
              <motion.div
                onClick={e => e.stopPropagation()}
                className="relative landscape:w-[80vh] portrait:w-[90vw] aspect-square cursor-default overflow-hidden rounded-lg"
              >
                { children[activeElementIndex] }
              </motion.div>
            </div>
        }
        {
          children.length !== 1 && 
          <div className="flex flex-col gap-2 h-[80vw] sm:h-[500px] overflow-y-auto no-scrollbar">
            {
              children.map((element, index) => {
                const isActive = activeElementIndex === index;

                return (
                  <div
                    key={index}
                    onClick={() => handleClick(index)}
                    className={clsx({
                      'w-[100px] h-[100px] border-[4px] shrink-0 cursor-pointer relative flex justify-center items-center rounded-lg overflow-hidden': true,
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
          className="w-[80vw] h-[80vw] sm:w-[500px] sm:h-[500px] relative flex justify-center items-center rounded-lg overflow-hidden cursor-pointer"
        >
          { children[activeElementIndex] }
        </div>
      </div>
    </>
  );
}