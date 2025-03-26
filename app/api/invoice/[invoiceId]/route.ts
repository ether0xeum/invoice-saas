import prisma from "@/app/utils/db";
import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { formatCurrency } from "@/app/utils/formatCurrency";

export async function GET(
    request: Request,
    {
        params
    }: {
        params: Promise<{ invoiceId: string }>;
    }
) {
    const { invoiceId } = await params;

    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
        },
        select: {
            invoiceName: true,
            invoiceNumber: true,
            currency: true,
            fromName: true,
            fromEmail: true,
            fromAddress: true,
            clientName: true,
            clientEmail: true,
            clientAddress: true,
            date: true,
            dueDate: true,
            invoiceItemDescription: true,
            invoiceItemQuantity: true,
            invoiceItemRate: true,
            total: true,
            note: true,
        }
    });

    if (!data) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    pdf.setFont("helvetica");
    pdf.setFontSize(24);
    pdf.text(data.invoiceName, 20, 20);

    // From Section
    pdf.setFontSize(12);
    pdf.text("From", 20, 40);
    pdf.setFontSize(10);
    pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 45);

    // Client Section
    pdf.setFontSize(12);
    pdf.text("Bill to", 20, 70);
    pdf.setFontSize(10);
    pdf.text([data.clientName, data.clientEmail, data.clientAddress], 20, 75);

    // Invoice Details
    pdf.setFontSize(10);
    pdf.text(`Invoice Number: #${data.invoiceNumber}`, 120, 40);
    pdf.text(
        `Date: ${new Intl.DateTimeFormat("es-PY", {
            dateStyle: "long"
        }).format(new Date(data.date))}`,
        120,
        45
    );
    pdf.text(`Due Date: ${data.dueDate}`, 120, 50);

    const startY = 100;
    let currentY = startY;
    const leftX = 20;
    const rightX = 190;
    const invoiceItems = Array.from({ length: 10 }, () => data);

    pdf.line(20, currentY - 5, 190, currentY - 5);

    // Item table header
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Description", 22, currentY);
    pdf.text("Quantity", 100, currentY);
    pdf.text("Rate", 130, currentY);
    pdf.text("Total", 160, currentY);

    // Draw header line
    currentY += 2;
    pdf.line(20, currentY, 190, currentY);

    // Item Details
    pdf.setFont("helvetica", "normal");
    currentY += 8;

    let totalInvoice = 0;

    invoiceItems.forEach((item: any) => {
        pdf.text(item.invoiceItemDescription, 22, currentY);
        pdf.text(item.invoiceItemQuantity.toString(), 100, currentY);
        pdf.text(
            formatCurrency({ amount: item.invoiceItemRate, currency: item.currency as any }),
            130,
            currentY
        );
        pdf.text(
            formatCurrency({ amount: item.total, currency: item.currency as any }),
            160,
            currentY
        );

        totalInvoice += item.total;
        currentY += 5;

        pdf.line(20, currentY, 190, currentY);
        currentY += 8;
    });

    pdf.line(leftX, startY - 5, leftX, currentY - 8); // Línea izquierda
    pdf.line(rightX, startY - 5, rightX, currentY - 8); // Línea derecha

    // Total Section
    // pdf.line(20, 115, 190, 115);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Total (${data.currency})`, 130, 240);
    pdf.text(
        formatCurrency({ amount: totalInvoice, currency: data.currency as any }),
        160,
        240
    );

    // Additional Note
    if (data.note) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text("Note: ", 20, 250);
        pdf.text(data.note, 20, 255);
    }

    // generate pdf as buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

    // return pdf as download
    return new Response(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline",
        },
    });
}
