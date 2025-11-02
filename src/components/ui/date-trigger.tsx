import { MdKeyboardArrowDown } from "react-icons/md";

interface DateTriggerProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  muted?: boolean;
}

export const DateTrigger: React.FC<DateTriggerProps> = ({
  label,
  isActive,
  onClick,
  muted = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "flex h-12 flex-1 items-center justify-between rounded-[16px] border px-4 text-[15px] font-medium transition",
      isActive ? "border-[3px] border-[#131316]" : "border border-[#EFF1F6]",
      muted ? "bg-[#F5F7FA] text-[#56616B]" : "bg-white text-[#131316]",
    ]
      .filter(Boolean)
      .join(" ")}
  >
    <span>{label}</span>
    {isActive ? (
      <MdKeyboardArrowDown
        size={18}
        className="rotate-180 transition-transform"
      />
    ) : (
      <MdKeyboardArrowDown size={18} />
    )}
  </button>
);
