const BASE = "/api/v1/auth";

export interface AuthUser {
    id: number;
}

export interface SignUpInput {
    email: string;
    password: string;
}

export interface SignInInput {
    email: string;
    password: string;
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...options,
        credentials: "include", // send/receive cookies
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data as T;
}

export const authApi = {
    signUp: (input: SignUpInput) =>
        request<{ success: boolean; user: AuthUser }>(`${BASE}/sign-up`, {
            method: "POST",
            body: JSON.stringify(input),
        }),

    signIn: (input: SignInInput) =>
        request<{ success: boolean; user: AuthUser }>(`${BASE}/sign-in`, {
            method: "POST",
            body: JSON.stringify(input),
        }),

    profile: () =>
        request<{ success: boolean; user: AuthUser }>(`${BASE}/profile`, {
            method: "GET",
        }),

    signOut: () =>
        request<{ success: boolean; message: string }>(`${BASE}/sign-out`, {
            method: "POST",
        }),
};
