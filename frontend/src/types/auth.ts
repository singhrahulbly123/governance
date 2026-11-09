export type Role = {
    name: string;
    slug: string;
};

export type CurrentUser = {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    permissions: Role[];
};

export type AdministrationRole = "administrator" | "super-administrator";
