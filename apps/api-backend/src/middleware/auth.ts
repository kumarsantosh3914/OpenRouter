import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";

export interface AuthenticatedRequest extends Request {
  apiKey?: string;
  apiKeyDb?: {
    id: number;
    apiKey: string;
    disabled: boolean;
    deleted: boolean;
    creditsConsumed: number;
    userId: number;
    user: {
      id: number;
      email: string;
      credits: number;
    };
  };
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers["authorization"];
    const apiKey = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!apiKey) {
      return res.status(401).json({ error: "Missing API key" });
    }

    console.log("apiKey", apiKey);

    const apiKeyDb = await prisma.apiKey.findUnique({
      where: { apiKey },
      include: {
        user: true,
      },
    });

    console.log("apiKeyDb", apiKeyDb);

    if (!apiKeyDb || apiKeyDb.deleted || apiKeyDb.disabled) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    if (!apiKeyDb.user || apiKeyDb.user.credits <= 0) {
      return res.status(402).json({ error: "Insufficient credits" });
    }

    (req as AuthenticatedRequest).apiKey = apiKey;
    (req as AuthenticatedRequest).apiKeyDb = {
      id: apiKeyDb.id,
      apiKey: apiKeyDb.apiKey,
      disabled: apiKeyDb.disabled,
      deleted: apiKeyDb.deleted,
      creditsConsumed: apiKeyDb.creditsConsumed,
      userId: apiKeyDb.userId,
      user: {
        id: apiKeyDb.user.id,
        email: apiKeyDb.user.email,
        credits: apiKeyDb.user.credits,
      },
    };

    next();
  } catch (error) {
    console.error("authMiddleware error", error);
    return res.status(500).json({ error: "Internal authentication error" });
  }
}