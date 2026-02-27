export interface Message {
    role: "user" | "assistant";
    content: string;
}

export interface Conversation {
    model: string;
    messages: Message[];
}