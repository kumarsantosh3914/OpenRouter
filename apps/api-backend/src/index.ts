import "dotenv/config";
import express, { Request, Response } from "express";
import { authMiddleware, AuthenticatedRequest } from "./middleware/auth";
import { Conversation } from "./types";
import prisma from "./lib/prisma";
import { LlmResponse } from "./llms/Base";
import { Gemini } from "./llms/Gemini";
import { Openai } from "./llms/Openai";
import { Claude } from "./llms/Claude";

const app = express();
const PORT = process.env.API_BACKEND_PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "api-backend" });
});

app.post(
  "/api/v1/chat/completions",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { model, messages } = req.body as Conversation;

      if (!model || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          error: "Invalid request body: model and messages are required",
        });
      }

      const { apiKey, apiKeyDb } = req as AuthenticatedRequest;

      if (!apiKey || !apiKeyDb) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const [_companyName, providerModelName] = model.split("/");

      const modelDb = await prisma.model.findFirst({ where: { slug: model } });
      if (!modelDb) {
        return res.status(403).json({
          error: "Invalid model: we don't support this model",
        });
      }

      const providers = await prisma.modelProviderMapping.findMany({
        where: { modelId: modelDb.id },
        include: { provider: true },
      });

      if (!providers.length) {
        return res
          .status(503)
          .json({ error: "No providers configured for this model" });
      }

      const provider =
        providers[Math.floor(Math.random() * providers.length)];

      if (!provider) {
        return res.status(503).json({
          error: "No provider could be selected for this model",
        });
      }

      let response: LlmResponse | null = null;

      if (
        provider?.provider.name === "Google API" ||
        provider?.provider.name === "Google Vertex"
      ) {
        response = await Gemini.chat(providerModelName as string, messages);
      } else if (provider?.provider.name === "OpenAI") {
        response = await Openai.chat(providerModelName as string, messages);
      } else if (provider?.provider.name === "Anthropic") {
        response = await Claude.chat(providerModelName as string, messages);
      }

      if (!response) {
        return res.status(503).json({
          error: "No provider could handle this request",
        });
      }

      // Pricing: inputTokenCost/outputTokenCost are defined in ModelProviderMapping
      // as "credits per 1,000 tokens".
      const inputCostPerThousand = provider.inputTokenCost ?? 0;
      const outputCostPerThousand = provider.outputTokenCost ?? 0;

      const creditsUsedRaw =
        (response.inputTokensConsumed * inputCostPerThousand +
          response.outputTokensConsumed * outputCostPerThousand) / 10;

      // Ensure we never charge negative credits and round to a sensible precision.
      const creditsUsed = Math.max(0, Number(creditsUsedRaw.toFixed(4)));

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: apiKeyDb.userId },
          data: { credits: { decrement: creditsUsed } },
        });

        await tx.apiKey.update({
          where: { apiKey },
          data: { creditsConsumed: { increment: creditsUsed } },
        });

        await tx.conversation.create({
          data: {
            userId: apiKeyDb.userId,
            apiKeyId: apiKeyDb.id,
            modelProviderMappingId: provider.id,
            input: JSON.stringify(messages),
            output:
              response.completions.choices[0]?.message?.content ?? "",
            inputTokenCount: response.inputTokensConsumed,
            outputTokenCount: response.outputTokensConsumed,
          },
        });
      });

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Start server
app.listen(Number(PORT), () => {
  console.log(`API backend server running on port ${PORT}`);
});
