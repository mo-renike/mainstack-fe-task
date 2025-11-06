import React from "react";
import type { ReactNode } from "react";
import { CustomButton } from "../ui/custom-button";
import CustomText from "../ui/custom-text";

interface CustomDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  footerClassName?: string;
  overlayClassName?: string;
  onAction?: () => void;
  onCancel?: () => void;
  actionText?: string;
  cancelText?: string;
  actionDisabled?: boolean;
  cancelDisabled?: boolean;
}

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onClose,
  title,
  children,
  className = "",
  contentClassName = "",
  footerClassName = "",
  overlayClassName = "",
  onAction,
  onCancel,
  actionText = "Apply",
  cancelText = "Cancel",
  actionDisabled = false,
  cancelDisabled = false,
}) => {
  const overlayClasses = [
    "fixed inset-0 z-40 bg-black/40 transition-opacity duration-700",
    open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
    overlayClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const drawerClasses = [
    "fixed top-0 right-0 z-50 flex h-full md:w-[456px] w-full flex-col transform bg-white p-[24px] shadow-lg transition-transform duration-700 ease-in-out",
    open ? "translate-x-0" : "translate-x-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const contentClasses = ["mt-4 flex-1 overflow-y-auto", contentClassName]
    .filter(Boolean)
    .join(" ");

  const footerClasses = [
    "mt-6 flex items-center justify-between gap-3",
    footerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const showActions = Boolean(onAction || onCancel);

  return (
    <>
      <div aria-hidden={!open} onClick={onClose} className={overlayClasses} />

      <aside role="dialog" aria-modal="true" className={drawerClasses}>
        <div className="flex items-center justify-between">
          {title ? <CustomText variant="h3" text={title} /> : null}
          <button
            type="button"
            aria-label="Close drawer"
            className="text-[#131316]"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={contentClasses}>{children}</div>

        {showActions ? (
          <div className={footerClasses}>
            {onCancel ? (
              <CustomButton
                variant="outline"
                onClick={onCancel}
                disabled={cancelDisabled}
                className="text-[16px] w-full"
              >
                {cancelText}
              </CustomButton>
            ) : null}
            {onAction ? (
              <CustomButton
                variant="primary"
                onClick={onAction}
                disabled={actionDisabled}
                className="text-[16px] w-full"
              >
                {actionText}
              </CustomButton>
            ) : null}
          </div>
        ) : null}
      </aside>
    </>
  );
};

export default CustomDrawer;
