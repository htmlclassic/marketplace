'use client';

import clsx from "clsx";
import { useState } from "react";

interface Props {
  elements: ({
    node: React.ReactNode;
    title: string;
  })[];
}

export function Tabs({ elements }: Props) {
  const [tabIndex, setTabIndex] = useState(0);

  const content = elements.map((el, i) =>
    <div key={i} className={clsx({
      "hidden": i !== tabIndex,
    })}>
      {el.node}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex rounded-lg border w-max overflow-hidden">
        {
          elements.map((el, i) =>
            <div
              onClick={() => setTabIndex(i)}
              className={clsx({
                "p-3 cursor-pointer transition-all duration-300": true,
                "text-black": i === tabIndex,
                "text-gray-400": i !== tabIndex
              })}
              key={i}
            >
              {el.title}
            </div>
          )
        }
      </div>
      <div>
        {content}
      </div>
    </div>
  );
}