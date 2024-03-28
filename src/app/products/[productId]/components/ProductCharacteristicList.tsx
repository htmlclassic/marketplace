import { Fragment } from "react";

interface Props {
  maxRows: number;
  characteristics: { name: string; value: string }[];
}

export default function ProductCharacteristicList({ characteristics, maxRows }: Props) {
 return (
  <div className="grid gap-y-5 gap-x-1 grid-cols-2 items-center relative text-sm max-w-[800px]">
    {
      characteristics.slice(0, maxRows).map(({ name, value }, i) =>
          <Fragment key={i}>
            <div className="flex items-center">
              <span className="[overflow-wrap:anywhere] lg:[overflow-wrap:normal] lg:overflow-hidden text-ellipsis text-gray-500" title={name}>{name}</span>
              <div className="border-b border-dashed grow mx-1 min-w-[50px] shrink-0"></div>
            </div>
            <div className="[overflow-wrap:anywhere] lg:[overflow-wrap:normal] lg:overflow-hidden text-ellipsis" title={value}>{value}</div>
          </Fragment>
        )
    }
  </div>
 );
}