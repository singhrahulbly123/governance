import Link from "next/link";

export default function NotFound() {
    return <main className="grid min-h-screen place-items-center px-6"><div className="text-center"><p className="text-sm font-semibold tracking-widest text-indigo-700 uppercase">404</p><h1 className="mt-2 text-3xl font-semibold">Page not found</h1><Link className="mt-5 inline-block text-sm font-semibold text-indigo-700 hover:text-indigo-900" href="/admin">Return to administration</Link></div></main>;
}
