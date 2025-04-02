"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema } from "./utils/zodSchema";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { emailClient } from "./utils/mailtrap";
import { formatCurrency } from "./utils/formatCurrency";


export async function onboardUser(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: onboardingSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const data = await prisma.user.update({
        where: {
            id: session.user?.id,
        },
        data: {
            firstName: submission.value.firstName,
            lastName: submission.value.lastName,
            address: submission.value.address,
        },
    });

    return redirect("/dashboard");
}

export async function createInvoice(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: invoiceSchema,
    })

    if (submission.status !== "success") {
        return submission.reply();
    }

    const data = await prisma.invoice.create({
        data: {
            clientAddress: submission.value.clientAddress,
            clientEmail: submission.value.clientEmail,
            clientName: submission.value.clientName,
            currency: submission.value.currency,
            date: submission.value.date,
            dueDate: submission.value.dueDate,
            fromAddress: submission.value.fromAddress,
            fromEmail: submission.value.fromEmail,
            fromName: submission.value.fromName,
            invoiceItemDescription: submission.value.invoiceItemDescription,
            invoiceItemQuantity: submission.value.invoiceItemQuantity,
            invoiceItemRate: submission.value.invoiceItemRate,
            invoiceName: submission.value.invoiceName,
            invoiceNumber: submission.value.invoiceNumber,
            status: submission.value.status,
            total: submission.value.total,
            note: submission.value.note,
            userId: session.user?.id,
        }
    });

    const sender = {
        email: "hello@demomailtrap.co",
        name: "Mailtrap Test",
    };

    emailClient.send({
        from: {
            email: sender.email,
        },
        to: [{ email: "jodasjodida@gmail.com" }],
        template_uuid: "2e70c41f-c5ea-4222-a52c-21ae52e10202",
        template_variables: {
            clientName: submission.value.clientName,
            invoiceNumber: submission.value.invoiceNumber,
            dueDate: new Intl.DateTimeFormat("es-PY", {
                dateStyle: "long",
            }).format(new Date(submission.value.date)),
            totalAmount: formatCurrency({ amount: submission.value.total, currency: submission.value.currency as any }),
            invoiceLink: `http://localhost:3000/api/invoice/${data.id}`
        }
    });

    return redirect("/dashboard/invoices");
}

export async function editInvoice(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: invoiceSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const data = await prisma.invoice.update({
        where: {
            id: formData.get("id") as string,
            userId: session.user?.id,
        },
        data: {
            clientAddress: submission.value.clientAddress,
            clientEmail: submission.value.clientEmail,
            clientName: submission.value.clientName,
            currency: submission.value.currency,
            date: submission.value.date,
            dueDate: submission.value.dueDate,
            fromAddress: submission.value.fromAddress,
            fromEmail: submission.value.fromEmail,
            fromName: submission.value.fromName,
            invoiceItemDescription: submission.value.invoiceItemDescription,
            invoiceItemQuantity: submission.value.invoiceItemQuantity,
            invoiceItemRate: submission.value.invoiceItemRate,
            invoiceName: submission.value.invoiceName,
            invoiceNumber: submission.value.invoiceNumber,
            status: submission.value.status,
            total: submission.value.total,
            note: submission.value.note,
        },
    });

    const sender = {
        email: "hello@demomailtrap.co",
        name: "Mailtrap Test",
    };

    emailClient.send({
        from: {
            email: sender.email,
        },
        to: [{ email: "jodasjodida@gmail.com" }],
        template_uuid: "c9877026-270f-4c84-9c1f-62cf4bd5017d",
        template_variables: {
            clientName: submission.value.clientName,
            invoiceNumber: submission.value.invoiceNumber,
            dueDate: new Intl.DateTimeFormat("es-PY", {
                dateStyle: "long",
            }).format(new Date(submission.value.date)),
            totalAmount: formatCurrency({
                amount: submission.value.total,
                currency: submission.value.currency as any,
            }),
            invoiceLink: `http://localhost:3000/api/invoice/${data.id}`
        }
    });

    return redirect("/dashboard/invoices");
}

export async function DeleteInvoice(invoiceId: string) {
    const session = await requireUser();

    const data = await prisma.invoice.delete({
        where: {
            id: invoiceId,
            userId: session.user?.id,
        },
    });

    return redirect("/dashboard/invoices");
}


export async function MarkAsPaid(invoiceId: string) {
    const session = await requireUser();

    const data = await prisma.invoice.update({
        where: {
            id: invoiceId,
            userId: session.user?.id,
        },
        data: {
            status: "PAID",
        },
    });

    return redirect("/dashboard/invoices");
}