const BASE = "/api/v1/payments";

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

export interface Transaction {
    id: number;
    amount: number;
    status: string;
}

export const paymentsApi = {
    getBalance: () =>
        request<{ success: boolean; credits: number }>(`${BASE}/balance`),

    getTransactions: () =>
        request<{ success: boolean; transactions: Transaction[] }>(`${BASE}/transactions`),

    onramp: () =>
        request<{ success: boolean; message: string; credits: number; transaction: Transaction }>(
            `${BASE}/onramp`,
            { method: "POST" }
        ),
};
