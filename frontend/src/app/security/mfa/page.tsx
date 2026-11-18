import { redirect } from "next/navigation";

export default function SecurityMfaRedirectPage() {
    redirect("/security/profile");
}
