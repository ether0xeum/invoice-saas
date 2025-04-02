import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    {
        params
    }: {
        params: Promise<{ invoiceId: string }>
    }
) {
    try {
        const session = await requireUser();

        const { invoiceId } = await params;

        const invoiceData = await prisma.invoice.findUnique({
            where: {
                id: invoiceId,
                userId: session.user?.id,
            },
        });

        if (!invoiceData) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        const sender = {
            email: "hello@demomailtrap.co",
            name: "Mailtrap Test",
        };

        emailClient.send({
            from: {
                email: sender.email,
            },
            to: [{ email: invoiceData.clientEmail }],
            template_uuid: "bc05413d-9d5e-4a6b-892e-5a2b6282430c",
            template_variables: {
                first_name: invoiceData.clientName,
                company_info_name: "InvoiceDavid",
                company_info_address: "Aviadores del Chaco 1234",
                company_info_city: "Asunción",
                company_info_zip_code: "222556",
                company_info_country: "Paraguay"
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send email reminder" }, { status: 500 });
    }
}
