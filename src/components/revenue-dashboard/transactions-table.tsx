import { type FC, type ReactNode } from "react";
import {
  MdArrowDownward,
  MdCheck,
  MdClose,
  MdKeyboardArrowDown,
  MdUploadFile,
  MdAccessTime,
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

/* getErrorMessage is imported from utils/helpers */

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

type Props = {
  transactionsLoading: boolean;
  transactionsError: boolean;
  transactionsErrorObj: unknown;
  transactionsRefetch: () => unknown;
  mappedTransactions: TransactionDisplay[];
  transactionCount: number;
  onOpenFilter: () => void;
};

const TransactionsTable: FC<Props> = ({
  transactionsLoading,
  transactionsError,
  transactionsErrorObj,
  transactionsRefetch,
  mappedTransactions,
  transactionCount,
  onOpenFilter,
}) => {
  return (
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
            onClick={onOpenFilter}
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
  );
};

export default TransactionsTable;
