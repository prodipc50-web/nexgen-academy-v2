import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";

const app = express();
const PORT = 3000;

// Security & Header hardening middleware
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json({ limit: "5mb" }));

// In-memory lightweight rate limiter to prevent API abuse
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 60;

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "global";
  const now = Date.now();
  const clientData = requestCounts.get(ip);

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (clientData.count >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({ error: "Too many requests. Please slow down." });
  }

  clientData.count++;
  next();
}

function sanitizeString(str: unknown, maxLen = 4000): string {
  if (typeof str !== "string") return "";
  return str.slice(0, maxLen).replace(/[\0\x08]/g, "").trim();
}

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Gemini TTS Endpoint using gemini-3.1-flash-tts-preview
app.post("/api/tts", rateLimiter, async (req, res) => {
  try {
    const text = sanitizeString(req.body.text, 2000);
    const voiceName = sanitizeString(req.body.voiceName, 50) || "Kore";
    const stylePrompt = sanitizeString(req.body.stylePrompt, 500);

    if (!text) {
      return res.status(400).json({ error: "Text string is required" });
    }

    const ai = getGenAI();
    const promptText = stylePrompt ? `${stylePrompt}: ${text}` : text;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData?.data);

    if (!audioPart || !audioPart.inlineData?.data) {
      return res.status(500).json({ error: "No audio data received from Gemini TTS model." });
    }

    res.json({
      audio: audioPart.inlineData.data,
      mimeType: audioPart.inlineData.mimeType || "audio/pcm;rate=24000",
    });
  } catch (err: any) {
    console.error("Error generating TTS:", err);
    res.status(500).json({ error: err?.message || "Failed to generate speech audio." });
  }
});

// AI Assistant for Nexgen Computer Academy Operations
app.post("/api/ai-assistant", rateLimiter, async (req, res) => {
  try {
    const rawQuery = req.body.query;
    const query = sanitizeString(rawQuery, 4000);
    const academyContext = req.body.academyContext;
    const userRole = sanitizeString(req.body.userRole, 50) || "Admin";

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const ai = getGenAI();
    const systemPrompt = `You are the executive AI Operations Assistant for "Nexgen Computer Academy", a premier IT & Skill Development training institute.
Your goal is to provide accurate, insightful, executive-level summaries, statistics, advice, and recommendations based on the current live academy database context provided below.

Rules:
1. Always base your calculations and answers on the provided JSON data context.
2. User Role is: "${userRole}". If a counselor or trainer asks for financial data they aren't authorized for, gently remind them of permissions.
3. Be professional, concise, and structured (use markdown bullets, bold key metrics, and actionable recommendations).
4. Currency is BDT (৳) or Taka.
5. Highlight actionable priorities (e.g., overdue payments, hot leads requiring follow-up, low attendance batches).

Live Academy Context:
${JSON.stringify(academyContext || {}, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      },
    });

    res.json({ answer: response.text });
  } catch (err: any) {
    console.error("Error in AI assistant:", err);
    res.status(500).json({ error: err?.message || "Failed to generate response from AI Assistant." });
  }
});

// AI Image/SVG Vector Generator Endpoint with XSS sanitization
app.post("/api/generate-vector", rateLimiter, async (req, res) => {
  try {
    const prompt = sanitizeString(req.body.prompt, 1000);
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Create a professional, modern SVG graphic illustration for: "${prompt}". Return strictly the raw <svg> element code without any markdown formatting, wrappers, or backticks. Include gradients, drop shadows, and polished colors.`,
    });

    let svgText = response.text || "";
    svgText = svgText
      .replace(/```xml/gi, "")
      .replace(/```svg/gi, "")
      .replace(/```/g, "")
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/gi, "")
      .replace(/on\w+='[^']*'/gi, "")
      .replace(/javascript:/gi, "")
      .trim();

    res.json({ svg: svgText });
  } catch (err: any) {
    console.error("Error generating vector SVG:", err);
    res.status(500).json({ error: err?.message || "Failed to generate vector illustration." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
