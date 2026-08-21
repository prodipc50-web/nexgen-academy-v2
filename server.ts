import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

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
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceName = "Kore", stylePrompt = "" } = req.body;
    if (!text || typeof text !== "string") {
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
app.post("/api/ai-assistant", async (req, res) => {
  try {
    const { query, academyContext, userRole } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const ai = getGenAI();
    const systemPrompt = `You are the executive AI Operations Assistant for "Nexgen Computer Academy", a premier IT & Skill Development training institute.
Your goal is to provide accurate, insightful, executive-level summaries, statistics, advice, and recommendations based on the current live academy database context provided below.

Rules:
1. Always base your calculations and answers on the provided JSON data context.
2. User Role is: "${userRole || 'Admin'}". If a counselor or trainer asks for financial data they aren't authorized for, gently remind them of permissions.
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

// AI Image/SVG Vector Generator Endpoint
app.post("/api/generate-vector", async (req, res) => {
  try {
    const { prompt } = req.body;
    const ai = getGenAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Create a professional, modern SVG graphic illustration for: "${prompt}". Return strictly the raw <svg> element code without any markdown formatting, wrappers, or backticks. Include gradients, drop shadows, and polished colors.`,
    });

    let svgText = response.text || "";
    svgText = svgText.replace(/```xml/gi, "").replace(/```svg/gi, "").replace(/```/g, "").trim();

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
