import React from "react";

type Variant = "h1" | "h2" | "h3" | "p" | "small" | "strong";

interface CustomTextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: Variant;
  text?: string;
}

const VARIANT_MAP = {
  h1: ["h1", "text-[36px] font-bold text-[#131316]"],
  h2: ["h2", "text-[28px] font-bold text-[#131316]"],
  h3: ["h3", "text-[24px] font-bold text-[#131316]"],
  strong: ["strong", "text-[16px] font-semibold text-[#131316]"],
  p: ["p", "text-[16px] font-medium text-[#131316]"],
  small: ["small", "text-[14px] font-medium text-[#56616B]"],
} as const;

const CustomText: React.FC<CustomTextProps> = ({
  variant = "p",
  text,
  children,
  className = "",
  ...rest
}) => {
  const [Tag, baseClass] = VARIANT_MAP[variant];
  return (
    <Tag className={`${baseClass} ${className}`.trim()} {...rest}>
      {text ?? children}
    </Tag>
  );
};

export default CustomText;
