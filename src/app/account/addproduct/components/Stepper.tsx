import clsx from "clsx";

interface Props {
  step: number;
}

export default function Stepper({ step }: Props) {
  return (
    <div className="flex flex-col gap-2 items-center mb-10 w-[90%] max-w-[600px] mx-auto">
      <div className="relative text-sm w-full overflow-hidden">
        <div className="invisible">Placeholder</div>
        <div className={clsx({
          "transition-all duration-500 absolute top-0 left-1/2 -translate-x-1/2 w-max": true,
          "translate-y-0": step === 0,
          "-translate-y-[200%]": step !== 0
        })}>Основная информация</div>
        <div className={clsx({
          "transition-all duration-500 absolute top-0 left-1/2 -translate-x-1/2 w-max": true,
          "translate-y-0": step === 1,
          "-translate-y-[200%]": step !== 1
        })}>Добавление изображений</div>
      </div>
      <div className="relative w-full h-[2px] flex items-center justify-between bg-gray-200">
        <div className="relative z-10 w-2 h-2 bg-slate-600 rounded-full"></div>
        <div className={clsx({
          "relative z-10 w-2 h-2 rounded-full transition-all duration-700": true,
          "bg-slate-600": step === 1,
          "bg-slate-400": step !== 1
        })}></div>
        <div className={clsx({
          "absolute top-0 left-0 w-0 h-full bg-slate-400 transition-all duration-700": true,
          "w-1/2": step === 0,
          "w-full": step === 1
        })}></div>
      </div>
    </div>
  );
}