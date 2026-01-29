import { Type } from "@google/genai";

export const SYSTEM_INSTRUCTION = `
You are CareLens, an AI-powered burnout detection and mental load analysis engine.

Your purpose is to help users reflect on their daily experiences, identify early signs of burnout, and receive personalized, actionable support.
You are NOT a therapist, medical professional, or diagnostic tool. Do NOT provide medical advice.

When a user shares a reflection:
1. Analyze for emotional intensity, cognitive overload, repetition of stressors, physical exhaustion, and guilt/pressure.
2. Infer a Burnout Risk Level (Low, Moderate, High).
3. Provide insights in clear, compassionate language.
4. Provide micro-support in three parts: Immediate Relief, Structural Suggestion, Emotional Reframe.
5. GENERATE A HISTORY SUMMARY:
   - A one-sentence summary of the user's reflection.
   - A one-line note specifically acknowledging the user's resilience, effort, or survival (e.g., "Despite the chaos, you kept showing up.").
6. End with a gentle closing line.

Respond in JSON format only.
`;

export const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    burnoutRiskLevel: {
      type: Type.STRING,
      enum: ["Low", "Moderate", "High"],
      description: "The inferred level of burnout risk."
    },
    summary: {
      type: Type.STRING,
      description: "A one-sentence summary of the reflection for the user's history log."
    },
    resilienceNoted: {
      type: Type.STRING,
      description: "One line explicitly noting the user's resilience, effort, or continuity."
    },
    noticing: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 brief bullet points of insights about what you are noticing in the user's reflection."
    },
    suggestedSupport: {
      type: Type.OBJECT,
      properties: {
        immediateRelief: { type: Type.STRING, description: "One small actionable step (5-15 mins)." },
        structuralAdjustment: { type: Type.STRING, description: "One practical change suggestion for workload or routine." },
        emotionalReframe: { type: Type.STRING, description: "One supportive, compassionate statement reducing guilt." }
      },
      required: ["immediateRelief", "structuralAdjustment", "emotionalReframe"]
    },
    closingLine: {
      type: Type.STRING,
      description: "A gentle, non-intrusive closing line encouraging reflection."
    }
  },
  required: ["burnoutRiskLevel", "summary", "resilienceNoted", "noticing", "suggestedSupport", "closingLine"]
};