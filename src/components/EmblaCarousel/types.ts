import { EmblaCarouselType } from "embla-carousel";

export interface BasicProps {
  slidesCount: number;
  activeIndex: number;
  emblaApi: EmblaCarouselType | undefined;
}

export type NavArrowsProps = BasicProps & {
  loop: boolean;
  dragFree: boolean;
};