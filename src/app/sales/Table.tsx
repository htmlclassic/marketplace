'use client';

import { useEffect, useState } from "react";
import TableDesktop from "./TableDesktop";
import TableMobile from "./TableMobile";

interface Props {
  stats: SellerStatistics[];
}

export default function Table({ stats }: Props) {
  const [vw, setVw] = useState<number | null>(null);
  const BREAKPOINT = 640; // px

  useEffect(() => {
    const handleResize = () => setVw(window.innerWidth);

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full flex flex-col gap-5">
      {
        vw &&
        (
          vw > BREAKPOINT
          ? <TableDesktop stats={stats} />
          : <TableMobile stats={stats} />
        )
      }
    </div>
  );
}
