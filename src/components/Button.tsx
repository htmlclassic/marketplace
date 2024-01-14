'use client';

import clsx from "clsx";
import { motion } from "framer-motion"

interface Props {
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// add loading state
export default function Button({ children, onClick, className = '' }: Props) {
  const mergedClassName = clsx({
    'button': true,
    [className]: className
  });

  const scaleInner = {
    scaleInner: {
      scaleX: 1.03,
      scaleY: 1.02,

      transition: {
        type: 'spring',
        stiffness: 600,
        damping: 10
      }
    }
  };

  const scaleCircle = {
    scaleCircle: {
      width: '110%',
    }
  };

  return (
    <motion.button
      onClick={onClick}
      className={mergedClassName}
      whileHover={[ 'scaleInner', 'scaleCircle' ]}
    >
      <motion.div
        variants={scaleInner}
        className="bg-inherit rounded-[inherit] absolute top-0 left-0 w-full h-full z-[1] overflow-hidden"
      >
        <motion.div
          initial={{
            x: '-50%',
            y: '-50%',
            opacity: 0.6
          }}
          variants={scaleCircle}
          className="w-0 aspect-square bg-inherit after:block after:rounded-[inherit] after:w-full after:h-full after:bg-black after:bg-opacity-5 absolute z-[2] rounded-full top-1/2 left-1/2"
        ></motion.div>
      </motion.div>
      <span className="relative z-[3]">{ children }</span>
    </motion.button>
  );
}