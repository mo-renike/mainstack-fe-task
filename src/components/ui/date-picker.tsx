import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import {
  addMonths,
  formatMonthLabel,
  getCalendarDays,
  isSameDay,
  startOfMonth,
} from "../../utils/date-picker.utils";

interface DatePickerProps {
  value: Date | null;
  onChange: (next: Date) => void;
  className?: string;
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [visibleMonth, setVisibleMonth] = React.useState(() => {
    if (value) return startOfMonth(value);
    return startOfMonth(new Date());
  });

  React.useEffect(() => {
    if (value) {
      const monthStart = startOfMonth(value);
      if (monthStart.getTime() !== visibleMonth.getTime()) {
        setVisibleMonth(monthStart);
      }
    }
  }, [value]);

  const days = React.useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth]
  );

  return (
    <div
      className={`rounded-[16px] border border-[#EFF1F6] bg-white px-6 pb-6 pt-5 shadow-[0_6px_12px_rgba(92,115,131,0.08),0_4px_8px_rgba(92,115,131,0.08)] ${className}`}
    >
      <header className="mb-4 flex items-center justify-between text-[#131316]">
        <button
          type="button"
          aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#56616B] transition hover:bg-[#F5F7FA]"
          onClick={() => setVisibleMonth((prev) => addMonths(prev, -1))}
        >
          <MdChevronLeft size={18} />
        </button>
        <p className="text-[14px] font-semibold">
          {formatMonthLabel(visibleMonth)}
        </p>
        <button
          type="button"
          aria-label="Next month"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#56616B] transition hover:bg-[#F5F7FA]"
          onClick={() => setVisibleMonth((prev) => addMonths(prev, 1))}
        >
          <MdChevronRight size={18} />
        </button>
      </header>

      <div className="mb-3 grid grid-cols-7 text-center text-[12px] font-semibold text-[#77808A]">
        {WEEK_DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center text-[12px] font-medium">
        {days.map((day) => {
          const isCurrentMonth = day.month === visibleMonth.getMonth();
          const isSelected = value ? isSameDay(day.date, value) : false;
          return (
            <button
              key={day.key}
              type="button"
              onClick={() => onChange(day.date)}
              className={[
                "mx-auto flex h-10 w-10 items-center justify-center rounded-full transition cursor-pointer",
                isSelected
                  ? "bg-[#131316] text-white"
                  : "text-[#131316] hover:bg-[#F5F7FA]",
                !isCurrentMonth && !isSelected ? "text-[#C4CAD3]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;
