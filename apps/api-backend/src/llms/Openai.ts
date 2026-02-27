import OpenAI from "openai";
import { BaseLlm, LlmResponse } from "./Base";
import { Message } from "../types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class Openai extends BaseLlm {
    static async chat(model: string, messages: Message[]): Promise<LlmResponse> {
        const response = await client.responses.create({
            model,
            input: messages.map((m) => ({ role: m.role, content: m.content })),
        });

        return {
            inputTokensConsumed: response.usage?.input_tokens!,
            outputTokensConsumed: response.usage?.output_tokens!,
            completions: {
                choices: [
                    {
                        message: {
                            content: response.output_text,
                        },
                    },
                ],
            },
        };
    }
}