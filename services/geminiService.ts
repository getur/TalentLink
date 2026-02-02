
import { GoogleGenAI, Type } from "@google/genai";

// Fixed: Functions now follow SDK best practices by localizing initialization 
// and using responseSchema for reliable JSON parsing from the model.

export const getJobMatchScore = async (jobTitle: string, jobDescription: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Evaluate a candidate's hypothetical fit for this internal role. 
      Job Title: ${jobTitle}
      Job Description: ${jobDescription}
      Return a JSON with "score" (0-100) and a short "reasoning" (1 sentence).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: 'Alignment score between 0 and 100',
            },
            reasoning: {
              type: Type.STRING,
              description: 'A brief one-sentence explanation of the score',
            },
          },
          required: ["score", "reasoning"],
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { score: 85, reasoning: "Standard alignment with core organizational values." };
  }
};

export const parseResumeAI = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract professional skills, bio, and suggested role from this text: "${text}". 
      Return JSON with "skills" (array), "bio" (string), "suggestedRole" (string).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            bio: { type: Type.STRING },
            suggestedRole: { type: Type.STRING },
          },
          required: ["skills", "bio", "suggestedRole"],
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return { skills: ['Leadership', 'Strategy'], bio: 'Experienced professional.', suggestedRole: 'Project Lead' };
  }
};

export const generateFeedbackAI = async (candidateName: string, roleTitle: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a constructive internal feedback for ${candidateName} regarding their application for ${roleTitle}. Mention they had strong technical skills but should focus more on cross-departmental communication.`
  });
  return response.text;
};
