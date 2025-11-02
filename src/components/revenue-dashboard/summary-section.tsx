import { useMemo, type FC } from "react";
import Skeleton from "../states/skeleton";
import ErrorState from "../states/error-state";
import CustomText from "../ui/custom-text";
import { CustomButton, IconButton } from "../ui/custom-button";
import { MdInfoOutline } from "react-icons/md";
import type { TransactionResponse } from "../../services/types";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { currencyFormatter, dateLabelFormatter } from "../../utils/helpers";

type Metric = { label: string; value: string; hint: string };

type DateRange = { start: string | null; end: string | null };

interface SummarySectionProps {
  summaryLoading: boolean;
  summaryError: boolean;
  summaryErrorMessage?: string | null;
  onRetry: () => void;
  formattedBalance: string;
  metrics: Metric[];
  dateRange: DateRange;
  transactions: TransactionResponse[];
}

const MetricItem: FC<{ metric: Metric }> = ({ metric }) => (
  <div className="flex flex-col items-start">
    <div className="flex justify-between w-full items-center">
      <CustomText
        variant="small"
        className="text-[#56616B]"
        text={metric.label}
      />
      <IconButton title={metric.hint}>
        <MdInfoOutline color="#888F95" size={16} />
      </IconButton>
    </div>
    <CustomText variant="h2" text={metric.value} />
  </div>
);

type ChartPoint = {
  date: string;
  label: string;
  total: number;
};

const TransactionsChart: FC<{ transactions: TransactionResponse[] }> = ({
  transactions,
}) => {
  const data = useMemo<ChartPoint[]>(() => {
    if (!transactions?.length) {
      return [];
    }

    const groupedByDate = transactions.reduce((acc, transaction) => {
      const key = transaction.date;
      const direction = transaction.type === "withdrawal" ? -1 : 1;
      acc.set(key, (acc.get(key) ?? 0) + direction * transaction.amount);
      return acc;
    }, new Map<string, number>());

    const sortedEntries = Array.from(groupedByDate.entries()).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );

    return sortedEntries.map(([date, netAmount]) => {
      const parsedDate = new Date(date);
      const label = Number.isNaN(parsedDate.getTime())
        ? date
        : dateLabelFormatter.format(parsedDate);
      return {
        date,
        label,
        total: Number(netAmount.toFixed(2)),
      };
    });
  }, [transactions]);

  return (
    <div className="relative h-[180px] w-full">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <CustomText
            variant="small"
            className="text-[#56616B]"
            text="No transaction data available"
          />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
          >
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Tooltip
              cursor={{ stroke: "#FFB292", strokeWidth: 1 }}
              formatter={(value: string | number) =>
                currencyFormatter.format(Number(value))
              }
              labelStyle={{ color: "#1C1F27", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#FF5403"
              strokeWidth={1}
              fill="url(#summaryChartFill)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export const SummarySection: FC<SummarySectionProps> = ({
  summaryLoading,
  summaryError,
  summaryErrorMessage,
  onRetry,
  formattedBalance,
  metrics,
  dateRange,
  transactions,
}) => {
  return (
    <section className="p-12">
      {summaryLoading ? (
        <Skeleton variant="summary" />
      ) : summaryError ? (
        <ErrorState
          message={summaryErrorMessage ?? "Unable to load summary data."}
          onRetry={onRetry}
        />
      ) : (
        <div className="flex flex-col gap-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            <div className="gap-4 m-auto w-[60%]">
              <div className="flex items-center justify-start gap-12">
                <div>
                  <CustomText
                    variant="small"
                    className="text-[#56616B]"
                    text="Available Balance"
                  />
                  <CustomText variant="h1" text={formattedBalance} />
                </div>
                <CustomButton className="px-10" variant="primary">
                  Withdraw
                </CustomButton>
              </div>
              <div className="relative flex flex-col justify-end">
                <TransactionsChart transactions={transactions} />
                <div className="mt-4 border-t border-[#EFF1F6] flex justify-between text-[14px] font-medium text-[#56616B]">
                  <span>{dateRange.start ?? "Apr 1, 2022"}</span>
                  <span>{dateRange.end ?? "Apr 30, 2022"}</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[240px] space-y-5 mt-6 lg:mt-0">
              {metrics.map((metric) => (
                <MetricItem key={metric.label} metric={metric} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
