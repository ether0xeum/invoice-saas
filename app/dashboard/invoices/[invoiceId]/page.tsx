import { EditInvoice } from "@/app/components/EditInvoice";
import { auth } from "@/app/utils/auth";
import prisma from "@/app/utils/db";
import { notFound } from "next/navigation";

async function getData(invoiceId: string, userId: string) {
    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
            userId: userId,
        },
    });

    if (!data) {
        return notFound();
    }

    return data;
}

type Params = { params: Promise<{ invoiceId: string }> };

export default async function EditInvoiceRoute({ params }: Params) {
    const { invoiceId } = await params;
    const session = await auth();
    const data = await getData(invoiceId, session?.user?.id as string);
    return (
        <EditInvoice data={data} />
    );
}
