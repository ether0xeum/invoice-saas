import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, signIn } from "../utils/auth";
import { SubmitButton } from "../components/SubmitButtons";
import { redirect } from "next/navigation";

export default async function Login() {
    const session = await auth();

    if (session?.user) {
        redirect("/dashboard");
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-96 p-6 shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription className="text-sm">
                        Enter your email below to log in to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        action={async (formData) => {
                            "use server";
                            await signIn("nodemailer", formData);
                        }}
                        className="flex flex-col gap-y-4"
                    >
                        <div className="flex flex-col gap-y-2">
                            <Label>Email</Label>
                            <Input
                                name="email"
                                type="email"
                                required
                                placeholder="hello@hello.com"
                            />
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}