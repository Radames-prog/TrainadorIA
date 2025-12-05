import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, WorkoutPlan } from "../types";

const apiKey = process.env.API_KEY;

// Defined schema to ensure the model returns structured data we can render nicely
const workoutResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    workoutLetter: {
      type: Type.STRING,
      description: "The letter of the workout (A, B, or C).",
      enum: ["A", "B", "C"]
    },
    targetMuscles: {
      type: Type.STRING,
      description: "Short description of target muscles (e.g., Peito / Ombros / Tríceps).",
    },
    summary: {
      type: Type.STRING,
      description: "A brief summary of the workout focus.",
    },
    exercises: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          sets: { type: Type.STRING },
          reps: { type: Type.STRING },
          notes: { type: Type.STRING, description: "Specific tip for this exercise." }
        },
        required: ["name", "sets", "reps"]
      }
    },
    observations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "General observations, biomechanics tips, or intensity adjustments."
    }
  },
  required: ["workoutLetter", "targetMuscles", "exercises", "observations"]
};

export const generateWorkout = async (profile: UserProfile): Promise<WorkoutPlan> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    Você é o módulo de inteligência artificial de um aplicativo de treino estilo personal trainer virtual.
    Sua função é analisar o histórico do usuário e indicar qual treino deve ser feito hoje (A, B ou C).
    
    Lógica de Sequência:
    - Se último foi A -> Hoje é B.
    - Se último foi B -> Hoje é C.
    - Se último foi C ou NONE -> Hoje é A.
    - Se o usuário ficou muitos dias sem treinar (> 5 dias), considere reduzir o volume, mas mantenha a sequência lógica.
    
    Padrão Base (pode adaptar):
    - A: Peito / Ombros / Tríceps
    - B: Costas / Bíceps / Trapézio
    - C: Pernas / Glúteos / Abdômen

    Considere o objetivo (Hipertrofia, Força, etc.), o tempo disponível, gênero, idade, peso, altura e as restrições físicas (lesões).
    Nunca sugira exercícios que violem as restrições.
  `;

  const userPrompt = `
    Gere um treino completo baseado neste perfil:
    ${JSON.stringify(profile)}
    
    Detalhes importantes:
    - Gênero: ${profile.gender}
    - Idade: ${profile.age} anos
    - Peso: ${profile.weight} kg
    - Altura: ${profile.height} cm
    - Objetivo: ${profile.goal}
    - Nível: ${profile.level}
    - Restrições: ${profile.restrictions || "Nenhuma"}
    - Dias desde o último treino: ${profile.daysSinceLastWorkout}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: workoutResponseSchema,
        temperature: 0.7, 
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated.");
    }
    
    return JSON.parse(text) as WorkoutPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};