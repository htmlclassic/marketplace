'use client';

import clsx from "clsx";
import { useState } from "react";

interface Props {
  value: number;
  name?: string;
  readonly?: boolean;
  max?: number;
  size?: number;
}

export default function Rating({
  value: val, // active stars count
  max = 5, // total stars count
  name = 'rating', // input's name value
  readonly // not interactable
}: Props) {
  let initialValue = Math.round(val);

  if (!readonly && initialValue < 1) initialValue = 1;
  if (initialValue > max) initialValue = max;

  const [value, setValue] = useState(initialValue);

  const handleClick = (index: number) => {
    if (!readonly) {
      setValue(max - index);
    }
  };

  return (
    <div className="flex flex-row-reverse items-center w-max">
      <input type="hidden" name={name} value={value} />
      {
        new Array(max).fill(0).map((el, i) =>
          <div
            className={clsx({
              "p-1 first-of-type:pr-0 last-of-type:pl-0": true,
              "cursor-default": readonly,
              "peer hover:text-yellow-400 peer-hover:text-yellow-400 cursor-pointer": !readonly,
              "text-gray-400": i < max - value,
              "text-yellow-400": i >= max - value,
            })}
            onClick={() => handleClick(i)}
            key={i}
          >
            <svg
              className="w-[18px] h-[18px]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
            </svg>
          </div>
        )
      }
    </div>
  );
}