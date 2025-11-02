import { useState, type FC, type ReactNode } from "react";
import {
  MdArrowDownward,
  MdCheck,
  MdClose,
  MdKeyboardArrowDown,
  MdUploadFile,
  MdAccessTime,
} from "react-icons/md";
import { CustomButton } from "../components/ui/custom-button";
import CustomText from "../components/ui/custom-text";
import EmptyDataState from "../components/states/empty-data-state";
import { FloatingToolbar } from "../components/layout/floating-tool-bar";
import Skeleton from "../components/states/skeleton";
import ErrorState from "../components/states/error-state";
import FilterPanel from "../components/ui/filter-panel";
import { useTransactionsQuery, useWalletQuery } from "../services/queries";
import type { TransactionResponse } from "../services/types";
import { SummarySection } from "../components/revenue-dashboard/summary-section";
import {
  capitalize,
  formatCurrency,
  formatDate,
  toTitleCase,
} from "../utils/helpers";

type Metric = { label: string; value: string; hint: string };

type TransactionDisplay = {
  id: string;
  title: string;
  customer?: string;
  statusText: string;
  visualType: TransactionVisualType;
  amount: string;
  date: string;
};

type TransactionVisualType = "deposit" | "withdrawal" | "pending" | "failed";

const transactionAppearance: Record<
  TransactionVisualType,
  { bg: string; textColor: string; icon: ReactNode }
> = {
  deposit: {
    bg: "bg-[#E3FFF2]",
    textColor: "text-[#0F973D]",
    icon: <MdCheck size={18} />,
  },
  withdrawal: {
    bg: "bg-[#FFF3E0]",
    textColor: "text-[#F4A609]",
    icon: <MdArrowDownward size={18} />,
  },
  pending: {
    bg: "bg-[#FFF3E0]",
    textColor: "text-[#F4A609]",
    icon: <MdAccessTime size={18} />,
  },
  failed: {
    bg: "bg-[#FFE5E9]",
    textColor: "text-[#DD3347]",
    icon: <MdClose size={18} />,
  },
};

const RevenueDashboardPage: FC = () => {
  const {
    data: wallet,
    isLoading: walletLoading,
    isError: walletError,
    error: walletErrorObj,
    refetch: walletRefetch,
  } = useWalletQuery();

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    isError: transactionsError,
    error: transactionsErrorObj,
    refetch: transactionsRefetch,
  } = useTransactionsQuery();

  const [showFilter, setShowFilter] = useState(false);
  const [filteredTransactionsData, setFilteredTransactionsData] = useState<
    TransactionResponse[] | null
  >(null);

  const sourceTransactions = filteredTransactionsData ?? transactionsData ?? [];

  const mappedTransactions: TransactionDisplay[] =
    sourceTransactions?.map((transaction, index) => {
      const visualType = getTransactionVisualType(transaction);
      return {
        id:
          transaction.payment_reference ??
          `${transaction.type}-${transaction.date}-${index}`,
        title: getTransactionTitle(transaction),
        customer: transaction.metadata?.name,
        statusText: capitalize(transaction.status),
        visualType,
        amount: formatCurrency(transaction.amount),
        date: formatDate(transaction.date),
      };
    }) ?? [];

  const summaryLoading = walletLoading || transactionsLoading;
  const summaryError = walletError || transactionsError;
  const summaryErrorMessage = summaryError
    ? getErrorMessage(walletErrorObj ?? transactionsErrorObj)
    : null;

  const metrics: Metric[] =
    wallet == null
      ? []
      : [
          {
            label: "Ledger Balance",
            value: formatCurrency(wallet.ledger_balance),
            hint: "More information about ledger balance",
          },
          {
            label: "Total Payout",
            value: formatCurrency(wallet.total_payout),
            hint: "More information about total payout",
          },
          {
            label: "Total Revenue",
            value: formatCurrency(wallet.total_revenue),
            hint: "More information about total revenue",
          },
          {
            label: "Pending Payout",
            value: formatCurrency(wallet.pending_payout),
            hint: "More information about pending payout",
          },
        ];

  const transactionCount = mappedTransactions.length;
  const dateRange = sourceTransactions?.length
    ? {
        start: formatDate(
          sourceTransactions[sourceTransactions.length - 1].date
        ),
        end: formatDate(sourceTransactions[0].date),
      }
    : { start: null, end: null };

  return (
    <main className="relative mx-12 relative">
      <FilterPanel
        transactions={transactionsData}
        onApply={(filtered) => setFilteredTransactionsData(filtered)}
        onClose={() => setShowFilter(false)}
        open={showFilter}
      />
      <FloatingToolbar />
      <SummarySection
        summaryLoading={summaryLoading}
        summaryError={summaryError}
        summaryErrorMessage={summaryErrorMessage}
        onRetry={() => {
          void walletRefetch();
          void transactionsRefetch();
        }}
        formattedBalance={formatCurrency(wallet?.balance)}
        metrics={metrics}
        dateRange={dateRange}
        transactions={sourceTransactions}
      />
      <section className="mt-10 rounded-[32px] border border-[#EFF1F6] bg-white px-8 py-8 shadow-[0px_40px_80px_rgba(19,19,22,0.06)]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CustomText
              variant="h3"
              text={`${transactionCount} ${
                transactionCount === 1 ? "Transaction" : "Transactions"
              }`}
            />
            <CustomText
              variant="small"
              className="mt-1"
              text="Your transactions for the selected period"
            />
          </div>

          <div className="flex items-center gap-3">
            <CustomButton
              variant="ghost"
              className="gap-2 px-5 py-2.5"
              onClick={() => setShowFilter(true)}
            >
              <MdKeyboardArrowDown size={16} />
              Filter
            </CustomButton>
            <CustomButton variant="ghost" className="gap-2 px-5 py-2.5">
              <MdUploadFile size={16} />
              Export list
            </CustomButton>
          </div>
        </header>

        {transactionsLoading ? (
          <Skeleton variant="transactions" />
        ) : transactionsError ? (
          <div className="mt-6">
            <ErrorState
              message={getErrorMessage(transactionsErrorObj)}
              onRetry={() => void transactionsRefetch()}
            />
          </div>
        ) : transactionCount === 0 ? (
          <div className="mt-10">
            <EmptyDataState
              description="You have no transactions yet. Once customers start paying you, their transactions will appear here."
              action={
                <CustomButton variant="primary" className="px-6">
                  Share a product link
                </CustomButton>
              }
            />
          </div>
        ) : (
          <div className="mt-6 divide-y divide-[#EFF1F6]">
            {mappedTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

const TransactionRow: FC<{ transaction: TransactionDisplay }> = ({
  transaction,
}) => {
  const appearance = transactionAppearance[transaction.visualType];

  return (
    <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${appearance.bg} ${appearance.textColor}`}
        >
          {appearance.icon}
        </div>
        <div>
          <CustomText
            variant="p"
            className="text-[#131316]"
            text={transaction.title}
          />
          {transaction.customer && (
            <CustomText
              variant="small"
              className="text-[#56616B]"
              text={transaction.customer}
            />
          )}
          <CustomText
            variant="small"
            className={`mt-1 font-semibold ${appearance.textColor}`}
            text={transaction.statusText}
          />
        </div>
      </div>

      <div className="flex items-end justify-between gap-6 sm:gap-10">
        <CustomText
          variant="strong"
          className="text-[16px]"
          text={transaction.amount}
        />
        <CustomText
          variant="small"
          className="text-[#56616B]"
          text={transaction.date}
        />
      </div>
    </div>
  );
};

function getTransactionVisualType(
  transaction: TransactionResponse
): TransactionVisualType {
  if (transaction.status === "pending") return "pending";
  if (transaction.status === "failed") return "failed";
  return transaction.type === "withdrawal" ? "withdrawal" : "deposit";
}

function getTransactionTitle(transaction: TransactionResponse): string {
  if (transaction.metadata?.product_name) {
    return transaction.metadata.product_name;
  }
  if (transaction.type === "withdrawal") {
    return "Cash withdrawal";
  }
  if (transaction.metadata?.type) {
    return toTitleCase(transaction.metadata.type);
  }
  return toTitleCase(transaction.type);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong.";
}

export default RevenueDashboardPage;
