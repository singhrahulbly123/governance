"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn } from "@/services/api/auth";

export function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError("");
        const data = new FormData(event.currentTarget);

        try {
            const user = await signIn(String(data.get("email")), String(data.get("password")), data.get("remember") === "on");
            router.replace(user.roles.some((role) => role.slug === "super-administrator") ? "/super-admin" : "/admin");
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Sign in could not be completed.");
        } finally {
            setSubmitting(false);
        }
    }

    return <Card className="w-full max-w-md p-8"><form className="space-y-5" onSubmit={handleSubmit}><div><p className="text-sm font-semibold tracking-widest text-indigo-700 uppercase">DIA Thrive</p><h1 className="mt-2 text-2xl font-semibold tracking-tight">Administration sign in</h1><p className="mt-2 text-sm leading-6 text-slate-600">Use your administrator account to access the governance workspace.</p></div>{error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}<Input id="email" label="Email address" name="email" type="email" autoComplete="email" required /><Input id="password" label="Password" name="password" type="password" autoComplete="current-password" required /><label className="flex items-center gap-2 text-sm text-slate-700"><input name="remember" type="checkbox" className="size-4 rounded border-slate-300 text-indigo-700" /> Keep me signed in</label><Button className="w-full" disabled={submitting} type="submit">{submitting ? "Signing in…" : "Sign in"}</Button></form></Card>;
}
