const BASE = "/api/v1/models";

export interface Provider {
    id: number;
    name: string;
    website: string;
}

export interface Model {
    id: number;
    name: string;
    slug: string;
    company: {
        id: number;
        name: string;
        website: string;
    };
}

export interface ModelProviderMapping {
    id: number;
    inputTokenCost: number;
    outputTokenCost: number;
    model: {
        id: number;
        name: string;
        slug: string;
    };
    provider: {
        id: number;
        name: string;
        website: string;
    };
}

async function get<T>(url: string): Promise<T> {
    const res = await fetch(url, {
        credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data as T;
}

export const modelsApi = {
    getModels: () =>
        get<{ success: boolean; models: Model[] }>(`${BASE}`),

    getProviders: () =>
        get<{ success: boolean; providers: Provider[] }>(`${BASE}/providers`),

    getMappings: (modelId?: number) =>
        get<{ success: boolean; mappings: ModelProviderMapping[] }>(
            modelId ? `${BASE}/mappings?modelId=${modelId}` : `${BASE}/mappings`
        ),
};
