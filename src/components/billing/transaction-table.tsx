import type { Transaction } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatRMAdaptive } from "@/lib/format";
import { cn } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Receipt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((txn) => (
            <TableRow key={txn.id}>
              <TableCell className="text-muted-foreground">
                <time dateTime={txn.date}>{formatDate(txn.date)}</time>
              </TableCell>
              <TableCell className="font-medium">{txn.description}</TableCell>
              <TableCell>
                <StatusBadge status={txn.type} />
              </TableCell>
              <TableCell
                className={cn(
                  "text-right font-mono tabular-nums",
                  txn.amount > 0 ? "text-success" : "text-foreground"
                )}
              >
                {txn.amount > 0 ? "+" : ""}
                {formatRMAdaptive(txn.amount)}
              </TableCell>
              <TableCell>
                <StatusBadge status={txn.status} />
              </TableCell>
              <TableCell>
                {txn.receipt ? (
                  <code className="font-mono text-xs text-muted-foreground">
                    {txn.receipt}
                  </code>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
