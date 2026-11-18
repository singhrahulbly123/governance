import { redirect } from "next/navigation";

export default function SecuritySessionRedirectPage() {
    redirect("/session-expired");
}
