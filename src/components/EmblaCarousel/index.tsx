'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { EmblaOptionsType } from 'embla-carousel';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import NavDots from './NavDots';
import NavArrows from './NavArrows';

interface CustomOptions {
  hideNavigationDots?: boolean;
  hideNavigationArrows?: boolean;
}

interface Props {
  slides: React.ReactNode[];
  options?: EmblaOptionsType & CustomOptions;
}

// options.axis = 'y' - for vertical sliding
// options.dragFree = true - for free sliding
// options.hideNavigationDots = true - to hide nav dots
// options.hideNavigationArrows = true - to hide nav arrows
export default function EmblaCarousel({ slides, options }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [activeIndex, setActiveIndex] = useState(0);

  const hideNavigationDots = options?.hideNavigationDots ?? false;
  const hideNavigationArrows = options?.hideNavigationArrows ?? false;

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', e => setActiveIndex(e.selectedScrollSnap()))
    }
  }, [emblaApi])

  return (
    <div className="relative w-full h-full flex flex-col items-center gap-[10px]">
      {
        !hideNavigationArrows &&
          <NavArrows
            emblaApi={emblaApi}
            activeIndex={activeIndex}
            slidesCount={slides.length}
            loop={!!options?.loop}
            dragFree={!!options?.dragFree}
          />
      }
      <div className="w-full h-[calc(100%-14px)] overflow-hidden sm:rounded-lg" ref={emblaRef}>
        <div className={clsx({
          "flex h-full": true,
          "flex-col": options?.axis === 'y'
        })}>
          {
            slides.map((slide, index) => (
              <div className="relative shrink-0 w-full h-full" key={index}>
                {slide}
              </div>
            ))
          }
        </div>
      </div>
      {
        !hideNavigationDots &&
          <NavDots
            emblaApi={emblaApi} 
            activeIndex={activeIndex}
            slidesCount={slides.length}
          />
      }
    </div>
  )
}