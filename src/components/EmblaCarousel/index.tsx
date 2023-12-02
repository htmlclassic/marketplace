'use client';

import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import clsx from 'clsx';

interface Props {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
}

export default function EmblaCarousel({ slides, options }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  return (
    <div className="w-full h-full flex flex-col items-center gap-[10px]">
      <div className="w-full h-[calc(100%-14px)] overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div className="relative shrink-0 w-full h-full" key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex gap-3 items-center justify-center">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={clsx({
              "w-[12px] h-[4px] rounded-full": true,
              "bg-black": index === selectedIndex,
              "bg-gray-300": index !== selectedIndex
            })}
          />
        ))}
      </div>
    </div>
  )
}