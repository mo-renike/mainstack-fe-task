import { useState, type FC } from "react";
import TransactionsTable from "../components/revenue-dashboard/transactions-table";
import { FloatingToolbar } from "../components/layout/floating-tool-bar";
import FilterPanel from "../components/ui/filter-panel";
import { useTransactionsQuery, useWalletQuery } from "../services/queries";
import type { TransactionResponse } from "../services/types";
import { SummarySection } from "../components/revenue-dashboard/summary-section";
import {
  capitalize,
  formatCurrency,
  formatDate,
  getTransactionVisualType,
  getTransactionTitle,
  getErrorMessage,
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
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [filterPanelKey, setFilterPanelKey] = useState(0);

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
    <main className="relative py-16 w-[85%] m-auto relative">
      <FilterPanel
        key={filterPanelKey}
        transactions={transactionsData}
        onApply={(filtered, isFiltered, count) => {
          setHasActiveFilters(isFiltered);
          setActiveFilterCount(count ?? 0);
          setFilteredTransactionsData(isFiltered ? filtered : null);
        }}
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
      <TransactionsTable
        transactionsLoading={transactionsLoading}
        transactionsError={transactionsError}
        transactionsErrorObj={transactionsErrorObj}
        transactionsRefetch={transactionsRefetch}
        mappedTransactions={mappedTransactions}
        transactionCount={transactionCount}
        onOpenFilter={() => setShowFilter(true)}
        hasActiveFilters={hasActiveFilters}
        onClearFilter={() => {
          setFilteredTransactionsData(null);
          setHasActiveFilters(false);
          setActiveFilterCount(0);
          setFilterPanelKey((prev) => prev + 1);
        }}
        activeFilterCount={activeFilterCount}
      />
    </main>
  );
};

export default RevenueDashboardPage;
