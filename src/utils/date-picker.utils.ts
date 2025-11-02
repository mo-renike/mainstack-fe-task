export type CalendarDay = {
  date: Date;
  key: string;
  month: number;
};

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function getCalendarDays(month: Date): CalendarDay[] {
  const start = startOfMonth(month);
  const startWeekday = start.getDay();
  const mondayFirstIndex = (startWeekday + 6) % 7;
  const firstVisible = addDays(start, -mondayFirstIndex);

  return Array.from({ length: 42 }).map((_, index) => {
    const current = addDays(firstVisible, index);
    return {
      date: current,
      key: current.toISOString(),
      month: current.getMonth(),
    };
  });
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export function formatMonthLabel(date: Date): string {
  return monthFormatter.format(date);
}

const displayFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDisplayDate(date: Date) {
  return displayFormatter.format(date);
}

export function toIso(date: Date) {
  return date.toISOString().slice(0, 10);
}
