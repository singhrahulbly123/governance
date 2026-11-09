import { apiRequest } from "@/services/api/client";
import type { AdministrationOverview } from "@/types/administration";

export async function getAdministrationOverview(): Promise<AdministrationOverview> {
    const response = await apiRequest("/api/v1/administration/overview");

    if (!response.ok) {
        throw new Error("Could not load administration metrics.");
    }

    return ((await response.json()) as { data: AdministrationOverview }).data;
}
