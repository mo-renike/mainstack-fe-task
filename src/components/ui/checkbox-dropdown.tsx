import React from "react";
import { MdCheck, MdKeyboardArrowDown } from "react-icons/md";

export interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxDropdownProps {
  options: CheckboxOption[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const CheckboxDropdown: React.FC<CheckboxDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options",
  className = "",
}) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleOption = (optionValue: string) => {
    const isSelected = value.includes(optionValue);
    if (isSelected) {
      onChange(value.filter((item) => item !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  const summaryText =
    selectedLabels.length === 0 ? placeholder : selectedLabels.join(", ");

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={[
          "flex h-12 w-full items-center justify-between rounded-[12px] border px-4 text-left text-[14px] font-medium transition",
          open ? "border-[3px] border-[#131316]" : "border border-[#EFF1F6]",
          "bg-white text-[#131316]",
        ].join(" ")}
      >
        <span className="block w-[85%] truncate">{summaryText}</span>
        <MdKeyboardArrowDown
          size={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={[
          "absolute left-0 right-0 top-full z-20 mt-2 rounded-[12px] border border-[#EFF1F6] bg-white p-4 shadow-[0_6px_12px_rgba(92,115,131,0.08),0_4px_8px_rgba(92,115,131,0.08)] transition-all duration-200 ease-out",
          "origin-top transform",
          open
            ? "pointer-events-auto opacity-100 translate-y-0 scale-100"
            : "pointer-events-none opacity-0 -translate-y-1 scale-95",
        ].join(" ")}
        aria-hidden={!open}
        role="listbox"
      >
        <div className="space-y-2">
          {options.map((option) => {
            const checked = value.includes(option.value);
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-[12px] px-2 py-[10px] text-[16px] font-semibold text-[#131316] transition hover:bg-[#F5F7FA]"
              >
                <span
                  className={[
                    "flex h-5 w-5 items-center justify-center rounded-md border text-white transition",
                    checked
                      ? "border-[#131316] bg-[#131316]"
                      : "border-[#D8DFE7] bg-white text-transparent",
                  ].join(" ")}
                >
                  <MdCheck size={16} />
                </span>
                <span className="flex-1">{option.label}</span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() => toggleOption(option.value)}
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
