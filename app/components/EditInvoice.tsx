"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { SubmitButton } from "./SubmitButtons";
import { formatCurrency } from "../utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { editInvoice } from "../actions";
import { invoiceSchema } from "../utils/zodSchema";
import { Prisma } from "@prisma/client";

interface iAppProps {
    data: Prisma.InvoiceGetPayload<{}>;
}

export function EditInvoice({ data }: iAppProps) {
    const [lastResult, action] = useActionState(editInvoice, undefined);
    const [form, fields] = useForm({
        id: "invoice-form",
        lastResult,

        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: invoiceSchema,
            });
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onBlur",
    });

    const [selectedDate, setSelectedDate] = useState(data.date);
    const [rate, setRate] = useState(data.invoiceItemRate.toString());
    const [quantity, setQuantity] = useState(data.invoiceItemQuantity.toString());
    const [currency, setCurrency] = useState(data.currency);

    const calculateTotal = (Number(rate) || 0) * (Number(quantity) || 0);

    return (
        <Card className="w-full max-w-[100%] mx-auto">
            <CardContent className="p-6">
                <form
                    id={form.id}
                    action={action}
                    onSubmit={form.onSubmit}
                    noValidate
                >
                    <input
                        type="hidden"
                        className="sr-only"
                        aria-hidden
                        tabIndex={-1}
                        name={fields.date.name}
                        value={selectedDate.toISOString()}
                    />
                    <input type="hidden" name="id" value={data.id} />

                    <input
                        type="hidden"
                        name={fields.total.name}
                        value={calculateTotal}
                    />

                    <div className="flex flex-col gap-1 w-fit mb-6">
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary">Draft</Badge>
                            <Input
                                name={fields.invoiceName.name}
                                key={fields.invoiceName.key}
                                defaultValue={data.invoiceName}
                                placeholder="Test 123"
                            />
                        </div>
                        {fields.invoiceName.errors && (
                            <p className="text-sm text-red-500">{fields.invoiceName.errors}</p>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <Label htmlFor={fields.invoiceNumber.id} className="mb-1">Invoice No.</Label>
                            <div className="flex">
                                <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">#</span>
                                <Input
                                    name={fields.invoiceNumber.name}
                                    key={fields.invoiceNumber.key}
                                    defaultValue={data.invoiceNumber}
                                    className="rounded-l-none"
                                    placeholder="5"
                                />
                            </div>
                            {fields.invoiceNumber.errors && (
                                <p className="text-sm text-red-500">{fields.invoiceNumber.errors}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor={fields.currency.id} className="mb-1">Currency</Label>
                            <Select
                                defaultValue="USD"
                                name={fields.currency.name}
                                key={fields.currency.key}
                                onValueChange={(value) => setCurrency(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">
                                        United States Dollar -- USD
                                    </SelectItem>
                                    <SelectItem value="EUR">Euro -- EUR</SelectItem>
                                </SelectContent>
                            </Select>
                            {fields.currency.errors && (
                                <p className="text-red-500 text-sm">{fields.currency.errors}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <Label className="mb-1">From</Label>
                            <div className="space-y-2">
                                <Input
                                    name={fields.fromName.name}
                                    key={fields.fromName.key}
                                    placeholder="Your Name"
                                    defaultValue={data.fromName}
                                />
                                {fields.fromName.errors && (
                                    <p className="text-sm text-red-500">{fields.fromName.errors}</p>
                                )}
                                <Input
                                    name={fields.fromEmail.name}
                                    key={fields.fromEmail.key}
                                    placeholder="Your Email"
                                    defaultValue={data.fromEmail}
                                />
                                {fields.fromEmail.errors && (
                                    <p className="text-sm text-red-500">{fields.fromEmail.errors}</p>
                                )}
                                <Input
                                    name={fields.fromAddress.name}
                                    key={fields.fromAddress.key}
                                    placeholder="Your Address"
                                    defaultValue={data.fromAddress}
                                />
                                {fields.fromAddress.errors && (
                                    <p className="text-sm text-red-500">{fields.fromAddress.errors}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label className="mb-1">To</Label>
                            <div className="space-y-2">
                                <Input
                                    name={fields.clientName.name}
                                    key={fields.clientName.key}
                                    defaultValue={data.clientName}
                                    placeholder="Client Name"
                                />
                                {fields.clientName.errors && (
                                    <p className="text-sm text-red-500">{fields.clientName.errors}</p>
                                )}
                                <Input
                                    name={fields.clientEmail.name}
                                    key={fields.clientEmail.key}
                                    defaultValue={data.clientEmail}
                                    placeholder="Client Email"
                                />
                                {fields.clientEmail.errors && (
                                    <p className="text-sm text-red-500">{fields.clientEmail.errors}</p>
                                )}
                                <Input
                                    name={fields.clientAddress.name}
                                    key={fields.clientAddress.key}
                                    defaultValue={data.clientAddress}
                                    placeholder="Client Address"
                                />
                                {fields.clientAddress.errors && (
                                    <p className="text-sm text-red-500">{fields.clientAddress.errors}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <div className="mb-1">
                                <Label htmlFor={fields.date.id}>Date</Label>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[280px] text-left justify-start">
                                        <CalendarIcon />

                                        {selectedDate ? (
                                            new Intl.DateTimeFormat("es-PY", {
                                                dateStyle: "long",
                                            }).format(selectedDate)
                                        ) : (
                                            <span>Pick a Date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => setSelectedDate(date || new Date())}
                                        fromDate={new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                            {fields.date.errors && (
                                <p className="text-sm text-red-500">{fields.date.errors}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor={fields.dueDate.id} className="mb-1">Invoice Due</Label>
                            <Select
                                name={fields.dueDate.name}
                                key={fields.dueDate.key}
                                defaultValue={data.dueDate.toString()}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select due date" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Due on Reciept</SelectItem>
                                    <SelectItem value="15">Net 15</SelectItem>
                                    <SelectItem value="30">Net 30</SelectItem>
                                </SelectContent>
                            </Select>

                            {fields.dueDate.errors && (
                                <p className="text-sm text-red-500">{fields.dueDate.errors}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="hidden md:grid grid-cols-12 gap-4 mb-2 font-medium">
                            <p className="col-span-6">Description</p>
                            <p className="col-span-2">Quantity</p>
                            <p className="col-span-2">Rate</p>
                            <p className="col-span-2">Amount</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start mb-4">
                            <div className="md:col-span-6">
                                <label className="md:hidden text-sm font-medium mb-1 block">Description</label>
                                <Textarea
                                    name={fields.invoiceItemDescription.name}
                                    key={fields.invoiceItemDescription.key}
                                    defaultValue={data.invoiceItemDescription}
                                    placeholder="Item name & description"
                                    className="resize-none h-[80px] md:h-[44px]"
                                />
                                {fields.invoiceItemDescription.errors && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {fields.invoiceItemDescription.errors}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="md:hidden text-sm font-medium mb-1 block">Quantity</label>
                                <Input
                                    name={fields.invoiceItemQuantity.name}
                                    key={fields.invoiceItemQuantity.key}
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    type="number"
                                    placeholder="0"
                                    className="w-full"
                                />
                                {fields.invoiceItemQuantity.errors && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {fields.invoiceItemQuantity.errors}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="md:hidden text-sm font-medium mb-1 block">Rate</label>
                                <Input
                                    name={fields.invoiceItemRate.name}
                                    key={fields.invoiceItemRate.key}
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    type="number"
                                    placeholder="0"
                                    className="w-full"
                                />
                                {fields.invoiceItemRate.errors && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {fields.invoiceItemRate.errors}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="md:hidden text-sm font-medium mb-1 block">Amount</label>
                                <Input
                                    value={formatCurrency({
                                        amount: calculateTotal,
                                        currency: currency as any,
                                    })}
                                    disabled
                                    className="w-full bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end md:justify-end px-4">
                        <div className="w-full md:w-1/3">
                            <div className="flex justify-between py-2">
                                <span>Subtotal</span>
                                <span>
                                    {formatCurrency({
                                        amount: calculateTotal,
                                        currency: currency as any,
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-t">
                                <span>Total ({currency})</span>
                                <span className="font-medium underline underline-offset-2">
                                    {formatCurrency({
                                        amount: calculateTotal,
                                        currency: currency as any,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label className="mb-1">Notes</Label>
                        <Textarea
                            name={fields.note.name}
                            key={fields.note.key}
                            defaultValue={data.note ?? undefined}
                            placeholder="Add your Note/s right here..."
                        />
                        {fields.note.errors && (
                            <p className="text-sm text-red-500">{fields.note.errors}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-end mt-6">
                        <div>
                            <SubmitButton text="Update Invoice" />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
