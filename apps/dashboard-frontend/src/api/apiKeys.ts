const BASE = "/api/v1/api-keys";

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    return data as T;
}

export interface ApiKey {
    id: number;
    name: string;
    apiKey: string;
    disabled: boolean;
    createdAt: string;
    updatedAt: string;
}

export const apiKeysApi = {
    getAll: () =>
        request<{ success: boolean; apiKeys: ApiKey[] }>(BASE),

    create: (name: string) =>
        request<{ success: boolean; message: string; apiKey: ApiKey }>(BASE, {
            method: "POST",
            body: JSON.stringify({ name }),
        }),

    /** Toggle a key's disabled status */
    updateStatus: (id: number, disabled: boolean) =>
        request<{ success: boolean; message: string; apiKey: ApiKey }>(BASE, {
            method: "PUT",
            body: JSON.stringify({ id, disabled }),
        }),

    delete: (id: number) =>
        request<{ success: boolean; message: string }>(`${BASE}/${id}`, {
            method: "DELETE",
        }),
};
