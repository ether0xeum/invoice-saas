"use client"

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface iAppProps {
    text?: string;
    variant?: "link" | 
    "default" | 
    "destructive" | 
    "outline" | 
    "secondary" | 
    "ghost" | 
    null | 
    undefined;
}

export function SubmitButton({ text = "Submit", variant }: iAppProps) {
    const { pending } = useFormStatus();
    return (
        <>
            {pending ? (
                <Button disabled className="w-full">
                    <Loader2 className="size-4 mr-2 animate-spin" /> Please wait...
                </Button>
            ) : (
                <Button
                    type="submit"
                    className="w-full"
                    variant={variant}
                >
                    {text}
                </Button>
            )}
        </>
    );
}