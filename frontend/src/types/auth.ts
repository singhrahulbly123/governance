export type Role = {
    name: string;
    slug: string;
};

export type CurrentUser = {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    department?: string;
    avatar_url?: string | null;
    mfa_enabled?: boolean;
    is_active?: boolean;
    onboarded_at?: string | null;
    roles: Role[];
    permissions: Role[];
};

export type AdministrationRole = "administrator" | "super-administrator";

export type AuthScreenId =
    | "login"
    | "forgot"
    | "otp"
    | "reset"
    | "change"
    | "firsttime"
    | "mfa"
    | "sessionwarn"
    | "session"
    | "unauthorized"
    | "profile"
    | "dashboard";

export type ForgotPasswordResult = {
    sent: boolean;
    email: string;
    expires_in_seconds: number;
    demo_code?: string | null;
};

export type MfaVerifyResult = {
    verified: boolean;
    remember_device: boolean;
};
