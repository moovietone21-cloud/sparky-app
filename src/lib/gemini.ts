import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing. AI features will be disabled.");
}

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateExercise() {
  if (!ai) return null;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Згенеруй випадкову вправу для розвитку креативності. Формат JSON: { 'type': 'alternative_uses' | 'sentence_completion' | 'random_prompt', 'target': string, 'instruction': string }. Мова: українська.",
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating exercise:", error);
    return null;
  }
}

export async function evaluateCreativity(exerciseType: string, target: string, response: string) {
  if (!ai) return null;

  try {
    const genResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      config: {
        responseMimeType: "application/json",
      },
      contents: `Оціни креативність відповіді. 
      Тип вправи: ${exerciseType}
      Об'єкт/Завдання: ${target}
      Відповідь користувача: ${response}
      
      Надай оцінку від 1 до 10 та короткий коментар чому саме така оцінка.
      JSON: { 'score': number, 'feedback': string }
      Мова: українська.`
    });

    return JSON.parse(genResponse.text);
  } catch (error) {
    console.error("Error evaluating creativity:", error);
    return null;
  }
}
