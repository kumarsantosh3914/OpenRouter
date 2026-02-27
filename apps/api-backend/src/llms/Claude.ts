import Anthropic from "@anthropic-ai/sdk";
import { BaseLlm, LlmResponse } from "./Base";
import { Message } from "../types";
import { TextBlock } from "@anthropic-ai/sdk/resources";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export class Claude extends BaseLlm {
    static async chat(model: string, messages: Message[]): Promise<LlmResponse> {
        const response = await client.messages.create({
            max_tokens: 2048,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            model,
        });

        return {
            inputTokensConsumed: response.usage.input_tokens,
            outputTokensConsumed: response.usage.output_tokens,
            completions: {
                choices: response.content.map((c) => ({
                    message: {
                        content: (c as TextBlock).text
                    }
                })),
            },
        };
    }

    static async countTokens(model: string, messages: Message[]): Promise<number> {
        const response = await client.messages.create({
            max_tokens: 2048,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            model,
        });

        return response.usage.input_tokens + response.usage.output_tokens;
    }
}