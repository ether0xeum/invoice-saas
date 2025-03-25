import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoiceActions } from "./InvoiceActions";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";

async function getInvoices(userId: string) {
    const invoices = await prisma.invoice.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            clientName: true,
            total: true,
            status: true,
            createdAt: true,
            invoiceNumber: true,
            currency: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return invoices;
}

export async function InvoiceList() {
    const session = await requireUser();
    const invoices = await getInvoices(session.user?.id as string);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell>#{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.clientName}</TableCell>
                        <TableCell>{
                            formatCurrency({ amount: invoice.total, currency: invoice.currency as any, })}
                        </TableCell>
                        <TableCell>{invoice.status}</TableCell>
                        <TableCell>{invoice.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                            <InvoiceActions />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}