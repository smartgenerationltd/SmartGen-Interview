import { GoogleGenAI, Type } from "@google/genai";
import { InterviewConfig, ChatMessage, FeedbackReport } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const formatChatHistoryForPrompt = (chatHistory: ChatMessage[], candidateName: string): string => {
  return chatHistory
    .map(msg => `${msg.role === 'model' ? 'Interviewer' : candidateName}: ${msg.content}`)
    .join('\n\n');
};

export const generateFirstQuestion = async (config: InterviewConfig): Promise<string> => {
  const { companyName, jobRole, companyUrl, candidateName, language } = config;
  const prompt = `You are a senior hiring manager at ${companyName}, conducting an interview for the ${jobRole} position. Your goal is to adopt a communication style and tone that reflects the company’s professional environment based on their website: ${companyUrl}.
  
Embody this role fully. Use company-specific terminology or priorities in your questioning style.
  
Start the interview by welcoming the candidate, ${candidateName}, by name and asking your first relevant question about their fit for the role. Your response should ONLY contain the welcome and the first question. All your responses must be in ${language}.`;

  try {
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating first question:", error);
    return "I'm sorry, I encountered an error trying to start our interview. Could you please check the configuration and try again?";
  }
};

export const generateFollowUpQuestion = async (config: InterviewConfig, chatHistory: ChatMessage[]): Promise<string> => {
  const { companyName, companyUrl, candidateName, language } = config;
  const lastCandidateAnswer = chatHistory[chatHistory.length - 1]?.content;

  if (!lastCandidateAnswer) {
    return "I'm sorry, I didn't catch that. Could you please repeat your answer?";
  }

  const prompt = `You are a hiring manager for ${companyName}. The company's culture can be learned from ${companyUrl}. You are in the middle of an interview with a candidate named ${candidateName}.
  
Here is the conversation so far:
${formatChatHistoryForPrompt(chatHistory.slice(0, -1), candidateName)}
  
The candidate's (${candidateName}) last answer was: "${lastCandidateAnswer}"
  
Based on the candidate's last answer, generate a follow-up question that goes deeper into their experience or perspective. Refer directly to what they said. Make sure your question is aligned with the culture and values of the company. Keep the tone professional and engaging. Your response should ONLY contain the follow-up question. All your responses must be in ${language}.`;

  try {
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating follow-up question:", error);
    return "Apologies, I seem to have lost my train of thought. Let's try that again. Could you elaborate on your last point?";
  }
};

export const generateFeedbackReport = async (config: InterviewConfig, chatHistory: ChatMessage[]): Promise<FeedbackReport> => {
    const { jobRole, candidateName, language } = config;
    const fullTranscript = formatChatHistoryForPrompt(chatHistory, candidateName);

    const prompt = `The interview for the ${jobRole} role with candidate ${candidateName} is now complete. Based on the full conversation transcript provided below, please provide a score from 0-100 evaluating the candidate's performance, and write a professional narrative feedback report.
    
**Conversation Transcript:**
---
${fullTranscript}
---

Your response MUST be a JSON object containing a "score" (integer from 0 to 100) and a "report" (string).

The report string should use this structure with markdown for bold titles:
**Overall Assessment:** Provide a balanced summary of ${candidateName}'s overall performance and fit for the role.
**Key Strengths:** Highlight specific moments or answers that showed insight, relevance, or strong communication. Reference ${candidateName}'s actual responses.
**Areas for Improvement:** Offer respectful, constructive suggestions for improvement for ${candidateName}. Identify vague answers, missed opportunities, or lack of detail. Recommend methods like the STAR framework or including measurable results.

The entire report, including the titles ('Overall Assessment', etc.), must be written in ${language}.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: {
                            type: Type.INTEGER,
                            description: "A score from 0 to 100 evaluating the candidate's performance."
                        },
                        report: {
                            type: Type.STRING,
                            description: "The detailed narrative feedback report for the candidate, using markdown for bold titles (e.g., **Overall Assessment**)."
                        }
                    },
                    required: ["score", "report"]
                }
            }
        });
        const feedbackData = JSON.parse(response.text);
        return feedbackData;
    } catch (error) {
        console.error("Error generating feedback report:", error);
        return {
            score: 0,
            report: "There was an issue generating the feedback report. Please review the conversation manually."
        };
    }
};