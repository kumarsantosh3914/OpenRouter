import { GoogleGenAI } from "@google/genai";
import { BaseLlm, LlmResponse } from "./Base";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export class Gemini extends BaseLlm {
    static async chat(model: string, messages: Message[]): Promise<LlmResponse> {
        console.log("Gemini.chat", model, messages);
        const response = await ai.models.generateContent({
            model,
            contents: messages.map((m) => ({ text: m.content, role: m.role })),
        });

        return {
            inputTokensConsumed: response.usageMetadata?.promptTokenCount!,
            outputTokensConsumed: response.usageMetadata?.candidatesTokenCount!,
            completions: {
                choices: [
                    {
                        message: {
                            content: response.text!,
                        },
                    },
                ],
            },
        };
    }

    static async countTokens(model: string, messages: Message[]): Promise<number> {
        const response = await ai.models.countTokens({
            model,
            contents: messages.map((m) => ({ text: m.content, role: m.role })),
        });

        return response.totalTokens!;
    }
}