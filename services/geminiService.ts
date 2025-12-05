
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
          notes: { type: Type.STRING, description: "Specific tip for this exercise, focusing on safety or technique." }
        },
        required: ["name", "sets", "reps"]
      }
    },
    loadAdjustmentAdvice: {
      type: Type.STRING,
      description: "Specific advice on how to adjust weights based on experience level and days since last workout."
    },
    observations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "General observations, biomechanics tips, or intensity adjustments."
    }
  },
  required: ["workoutLetter", "targetMuscles", "exercises", "observations", "loadAdjustmentAdvice"]
};

export const generateWorkout = async (profile: UserProfile): Promise<WorkoutPlan> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    Você é o módulo de inteligência artificial "SmartFit AI", um personal trainer virtual de elite focado em biomecânica e segurança.
    Sua função é gerar um treino do dia (A, B ou C) altamente personalizado.
    
    Lógica de Sequência Obrigatória:
    - Se último foi A -> Hoje é B.
    - Se último foi B -> Hoje é C.
    - Se último foi C ou NONE -> Hoje é A.
    
    PROTOCOLOS DE SEGURANÇA E ADAPTAÇÃO BIOMÉTRICA (CRÍTICO):
    1. **Idade**: 
       - Se > 50 anos: Priorize aquecimento articular estendido, evite cargas axiais excessivas na coluna se o nível não for Avançado, e monitore volume.
       - Se < 18 anos: Foco total em técnica e controle motor antes da carga.
    2. **Peso/Altura (IMC)**:
       - Se o usuário tiver peso elevado para a altura (potencial sobrepeso/obesidade) E for Iniciante: EVITE exercícios de alto impacto (saltos, burpees, corridas explosivas) para proteger joelhos e tornozelos. Substitua por baixo impacto (elíptico, bike, exercícios de solo).
    3. **Gênero**:
       - Utilize como base para sugestão de volume em áreas específicas se o objetivo for estético (ex: ênfase em glúteos/posteriores para feminino, ombros/tronco para masculino), mas mantenha o equilíbrio funcional.
    4. **Objetivo 'Hipertrofia e Perda de Peso'**:
       - Mantenha a intensidade da musculação (para preservar massa magra).
       - Reduza levemente os intervalos de descanso para manter a frequência cardíaca elevada (efeito EPOC).
       - Sugira super-séries ou bi-sets se o nível for Intermediário/Avançado.

    AJUSTE DE CARGA (Preencha o campo loadAdjustmentAdvice):
    - Analise 'Nível' e 'Dias sem Treinar'.
    - Se Dias > 5: Instrua reduzir carga em 10-20% para readaptação (Deload).
    - Se Iniciante: Foque em "Repetições de Reserva" (terminar a série sentindo que faria mais 2 ou 3).
    - Se Avançado e Dias < 3: Instrua buscar a falha concêntrica ou RPE 9-10.
    - Seja específico e matemático na recomendação.

    Padrão de Divisão Sugerido (Adapte se necessário):
    - A: Empurrar (Peito, Ombros, Tríceps)
    - B: Puxar (Costas, Bíceps, Trapézio)
    - C: Membros Inferiores (Pernas Completas, Glúteos) + Core

    Gere a resposta SEMPRE em JSON seguindo o schema.
    Nunca sugira exercícios que violem as restrições físicas declaradas.
  `;

  const userPrompt = `
    Gere um treino seguro e eficiente para este perfil:
    ${JSON.stringify(profile)}
    
    DADOS VITAIS:
    - Gênero: ${profile.gender}
    - Idade: ${profile.age} anos
    - Peso: ${profile.weight} kg
    - Altura: ${profile.height} cm
    - Objetivo: ${profile.goal}
    - Nível: ${profile.level}
    - Tempo Disponível: ${profile.availableTime} min
    - Restrições Médicas/Dores: ${profile.restrictions || "Nenhuma relatada"}
    - Dias desde o último treino: ${profile.daysSinceLastWorkout}
    
    Instruções adicionais:
    - Se o usuário ficou > 5 dias parado, reduza o volume total em 20% para readaptação.
    - Inclua dicas específicas de execução nos exercícios.
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
        temperature: 0.5, // Lower temperature for more consistent/safe workouts
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
