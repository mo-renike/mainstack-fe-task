import { CustomButton } from "../ui/custom-button";
import type { FC } from "react";

const ErrorState: FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-[#FFE5E9] bg-[#FFF8F1] px-6 py-6 text-[#7A1D1D]">
    <p className="font-semibold">{message}</p>
    <div>
      <CustomButton variant="outline" className="px-5 py-2.5" onClick={onRetry}>
        Retry
      </CustomButton>
    </div>
  </div>
);

export default ErrorState;
