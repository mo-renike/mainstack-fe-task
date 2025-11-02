import { type FC, type ReactNode } from "react";
import {
  MdArrowDownward,
  MdCheck,
  MdClose,
  MdKeyboardArrowDown,
  MdOutlineFileDownload,
  MdAccessTime,
  MdOutlineReceiptLong,
} from "react-icons/md";
import CustomText from "../ui/custom-text";
import EmptyDataState from "../states/empty-data-state";
import Skeleton from "../states/skeleton";
import ErrorState from "../states/error-state";
import { CustomButton } from "../ui/custom-button";
import { getErrorMessage } from "../../utils/helpers";

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

      <div className="flex flex-col gap-0">
        <CustomText
          variant="strong"
          className="font-bold"
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

type Props = {
  transactionsLoading: boolean;
  transactionsError: boolean;
  transactionsErrorObj: unknown;
  transactionsRefetch: () => unknown;
  mappedTransactions: TransactionDisplay[];
  transactionCount: number;
  onOpenFilter: () => void;
  hasActiveFilters: boolean;
  onClearFilter: () => void;
};

const TransactionsTable: FC<Props> = ({
  transactionsLoading,
  transactionsError,
  transactionsErrorObj,
  transactionsRefetch,
  mappedTransactions,
  transactionCount,
  onOpenFilter,
  hasActiveFilters,
  onClearFilter,
}) => {
  return (
    <section className="mt-16">
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
            text="Your transactions for the selected period"
          />
        </div>

        <div className="flex items-center gap-2">
          <CustomButton variant="ghost" onClick={onOpenFilter}>
            Filter <MdKeyboardArrowDown size={16} />
          </CustomButton>
          <CustomButton variant="ghost">
            Export list
            <MdOutlineFileDownload size={16} />
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
        hasActiveFilters ? (
          <div className="mt-10">
            <EmptyDataState
              icon={
                <MdOutlineReceiptLong size={24} className="text-[#131316]" />
              }
              title="No matching transaction found for the selected filter"
              description="Change your filters to see more results, or add a new product."
              action={
                <CustomButton variant="outline" onClick={onClearFilter}>
                  Clear Filter
                </CustomButton>
              }
            />
          </div>
        ) : null
      ) : (
        <div className="mt-4">
          {mappedTransactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TransactionsTable;
