import { redirect } from "next/navigation";

export default function SecurityRecoveryRedirectPage() {
    redirect("/forgot-password");
}
