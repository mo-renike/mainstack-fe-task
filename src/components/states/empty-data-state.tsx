import React, { type ReactNode } from "react";
import CustomText from "../ui/custom-text";

interface EmptyDataStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyDataState: React.FC<EmptyDataStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={
        "w-[369px] m-auto flex flex-col items-start gap-4 " + className
      }
    >
      {icon && (
        <div className="h-[48px] w-[48px] rounded-full bg-[#EFF1F6] flex items-center justify-center">
          {icon}
        </div>
      )}
      {title && <CustomText variant="h2" text={title} />}
      {description && (
        <CustomText variant="p" className="text-[#56616B]" text={description} />
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyDataState;
