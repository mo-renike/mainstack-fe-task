import React from "react";
import type { FC } from "react";
import type { TransactionResponse } from "../../services/types";
import { CustomButton } from "./custom-button";
import DatePicker from "./date-picker";
import { DateTrigger } from "./date-trigger";
import { formatDisplayDate, toIso } from "../../utils/date-picker.utils";
import {
  presetDates,
  transactionStatusOptions,
  transactionTypeOptions,
} from "../../constants";
import { CheckboxDropdown } from "./checkbox-dropdown";
import CustomDrawer from "../layout/custom-drawer";
import CustomText from "./custom-text";

interface FilterPanelProps {
  transactions?: TransactionResponse[];
  onApply: (filtered: TransactionResponse[]) => void;
  onClose: () => void;
  open?: boolean;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

const FilterPanel: FC<FilterPanelProps> = ({
  transactions = [],
  onApply,
  onClose,
  open = false,
}) => {
  const [start, setStart] = React.useState<string | null>(null);
  const [end, setEnd] = React.useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(() =>
    transactionTypeOptions.map((option) => option.value)
  );
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>(() =>
    transactionStatusOptions.map((option) => option.value)
  );
  const [activePicker, setActivePicker] = React.useState<
    "start" | "end" | null
  >(null);

  const handleClose = React.useCallback(() => {
    setActivePicker(null);
    onClose();
  }, [onClose]);

  function applyFilters() {
    const typeSet = new Set(selectedTypes);
    const statusSet = new Set(selectedStatuses);

    const filtered = transactions.filter((t) => {
      if (start) {
        const startT = new Date(start).getTime();
        if (new Date(t.date).getTime() < startT) return false;
      }
      if (end) {
        const endT = new Date(end).getTime();
        if (new Date(t.date).getTime() > endT) return false;
      }

      if (typeSet.size > 0 && !typeSet.has(t.type)) return false;

      if (statusSet.size > 0 && !statusSet.has(t.status)) return false;

      return true;
    });

    onApply(filtered);
    handleClose();
  }

  function clearFilters() {
    setStart(null);
    setEnd(null);
    setSelectedTypes(transactionTypeOptions.map((option) => option.value));
    setSelectedStatuses(transactionStatusOptions.map((option) => option.value));
    setActivePicker(null);
    onApply(transactions);
  }

  function applyPreset(days: number) {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    setStart(toIso(startDate));
    setEnd(todayIso());
    setActivePicker(null);
  }

  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;

  const displayStart = startDate ? formatDisplayDate(startDate) : "Start date";
  const displayEnd = endDate ? formatDisplayDate(endDate) : "End date";

  function handleDateSelect(which: "start" | "end", date: Date) {
    const iso = toIso(date);
    if (which === "start") {
      setStart(iso);
      if (end && new Date(end).getTime() < date.getTime()) {
        setEnd(iso);
      }
    } else {
      setEnd(iso);
      if (start && new Date(start).getTime() > date.getTime()) {
        setStart(iso);
      }
    }
    setActivePicker(null);
  }

  const pickerValue =
    activePicker === "start"
      ? startDate
      : activePicker === "end"
      ? endDate
      : null;

  return (
    <CustomDrawer
      open={open}
      onClose={handleClose}
      title="Filter"
      contentClassName="space-y-5"
      onCancel={clearFilters}
      cancelText="Clear"
      onAction={applyFilters}
      actionText="Apply"
    >
      <>
        <div className="flex flex-wrap gap-2">
          {presetDates.map((preset) => (
            <CustomButton
              key={preset.label}
              variant="outline"
              className="px-[15px] py-[10px] text-sm"
              onClick={() => applyPreset(preset.days)}
            >
              {preset.label}
            </CustomButton>
          ))}
        </div>

        <div>
          <CustomText variant="strong" text="Date Range" />

          <div className="mt-2 flex gap-3">
            <DateTrigger
              label={displayStart}
              isActive={activePicker === "start"}
              muted={!startDate}
              onClick={() =>
                setActivePicker((prev) => (prev === "start" ? null : "start"))
              }
            />
            <DateTrigger
              label={displayEnd}
              isActive={activePicker === "end"}
              muted={!endDate}
              onClick={() =>
                setActivePicker((prev) => (prev === "end" ? null : "end"))
              }
            />
          </div>
          {activePicker && (
            <div className="mt-4">
              <DatePicker
                value={pickerValue}
                onChange={(date) => handleDateSelect(activePicker, date)}
              />
            </div>
          )}
        </div>

        <div>
          <CustomText variant="strong" text="Transaction Type" />
          <div className="mt-2">
            <CheckboxDropdown
              options={transactionTypeOptions}
              value={selectedTypes}
              onChange={setSelectedTypes}
              placeholder="Select transaction types"
            />
          </div>
        </div>

        <div>
          <CustomText variant="strong" text="Transaction Status" />
          <div className="mt-2">
            <CheckboxDropdown
              options={transactionStatusOptions}
              value={selectedStatuses}
              onChange={setSelectedStatuses}
              placeholder="Select statuses"
            />
          </div>
        </div>
      </>
    </CustomDrawer>
  );
};

export default FilterPanel;
