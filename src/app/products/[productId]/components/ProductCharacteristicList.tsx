import { Fragment } from "react";

interface Props {
  maxRows: number;
  characteristics: { name: string; value: string }[];
}

export default function ProductCharacteristicList({ characteristics, maxRows }: Props) {
 return (
  <div className="grid gap-y-5 gap-x-1 grid-cols-2 items-center relative text-sm">
    {
      characteristics.slice(0, maxRows).map(({ name, value }) =>
          <Fragment key={name}>
            <div className="flex items-center">
              <span className="overflow-hidden text-ellipsis">{name}</span>
              <div className="border-b border-dashed grow mx-1 min-w-[50px] shrink-0"></div>
            </div>
            <div className="overflow-hidden text-ellipsis">{value}</div>
          </Fragment>
        )
    }
  </div>
 );
}