"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
    useEffect(() => { console.error(error); }, [error]);

    return <main className="grid min-h-screen place-items-center px-6"><div className="max-w-md text-center"><h1 className="text-2xl font-semibold">Something went wrong</h1><p className="mt-3 text-sm leading-6 text-slate-600">The page could not be loaded. Please try again.</p><Button className="mt-5" onClick={reset}>Try again</Button></div></main>;
}
