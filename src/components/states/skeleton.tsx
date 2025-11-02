import type { FC } from "react";

const Skeleton: FC<{
  variant?: "summary" | "transactions";
  count?: number;
}> = ({ variant = "transactions", count = 4 }) => {
  if (variant === "summary") {
    return (
      <div className="animate-pulse">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="h-4 w-32 rounded bg-[#EEF1F6]" />
            <div className="h-10 w-48 rounded bg-[#EEF1F6]" />
            <div className="h-11 w-36 rounded-full bg-[#EEF1F6]" />
          </div>
          <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
            <div className="h-[180px] flex-1 rounded-[32px] bg-[#EEF1F6]" />
            <div className="w-full max-w-[240px] space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 rounded-2xl border border-[#EFF1F6] bg-[#F7F9FC]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex animate-pulse gap-4 py-5">
          <div className="h-10 w-10 rounded-full bg-[#EEF1F6]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-[#EEF1F6]" />
            <div className="h-3 w-32 rounded bg-[#EEF1F6]" />
          </div>
          <div className="hidden w-32 flex-col items-end space-y-2 sm:flex">
            <div className="h-4 w-24 rounded bg-[#EEF1F6]" />
            <div className="h-3 w-20 rounded bg-[#EEF1F6]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
