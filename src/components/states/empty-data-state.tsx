import React, { type ReactNode } from "react";

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
      className={"flex flex-col items-center text-center gap-4 " + className}
    >
      {icon && (
        <div className="h-12 w-12 rounded-2xl border border-[#EFF1F6] bg-white flex items-center justify-center">
          {icon}
        </div>
      )}
      {title && (
        <h2 className="text-[32px] md:text-[40px] leading-tight font-semibold text-[#131316]">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-base text-[#56616B] max-w-xl">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyDataState;
