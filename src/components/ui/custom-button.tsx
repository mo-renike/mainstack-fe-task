import React from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "navLink";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isActive?: boolean;
  href?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  isActive = false,
  href,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 text-[14px] font-[600] rounded-full px-6  py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";

  const variantStyles: Record<Exclude<ButtonVariant, "navLink">, string> = {
    primary:
      "bg-[#131316] text-white hover:bg-black focus:ring-black disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed",
    outline:
      "bg-white text-[#131316] border border-[#EFF1F6] hover:bg-black/5 focus:ring-[#131316] disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed",
    ghost:
      "bg-[#EFF1F6] text-[#131316] rounded-full px-8 py-3 hover:bg-[#E5E9F0] focus:ring-[#131316]/20 disabled:opacity-60 disabled:cursor-not-allowed",
  };

  const navLinkBase =
    "text-[#56616B] px-4 py-2.5 rounded-full text-[14px] font-[600] hover:text-black hover:bg-black/[0.04] focus:ring-[#131316] cursor-pointer";
  const navLinkActive = "bg-[#131316] text-white";

  const variantClass =
    variant === "navLink" ? navLinkBase : variantStyles[variant];

  const classes = `${base} ${variantClass} ${className} ${
    variant === "navLink" && isActive ? navLinkActive : ""
  }`.trim();

  if (variant === "navLink" && href) {
    return (
      <a
        href={href}
        className={classes}
        {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export const IconButton: React.FC<
  React.PropsWithChildren & { title?: string }
> = ({ children, title }) => (
  <button
    title={title}
    className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[#56616B] cursor-pointer"
  >
    {children}
  </button>
);
