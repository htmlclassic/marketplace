import { useMotionValueEvent, useScroll } from "framer-motion";

// if scrollbar y-offset is greater than scrollYOffset, fire the callback
// scrollYOffset has to be a value from 0 to 1
export function useLazyLoad(callback: Function, scrollYOffset: number = 0.8) {
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, 'change', (scrollProgress) => {
    if (scrollProgress > scrollYOffset) callback();
  })
}