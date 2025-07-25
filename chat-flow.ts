'use server';
/**
 * @fileOverview A flow for handling chat interactions with an AI model.
 *
 * - chat - A function that takes a user's message and returns an AI response.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { gemini15Pro } from '@genkit-ai/googleai';

export const ChatInputSchema = z.object({
  message: z.string().describe('The user message to the AI.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: gemini15Pro,
      prompt: `You are ChatGPT 4.5, a highly advanced and helpful AI assistant created by Progpt. You are proficient in both English and Bengali. You should provide detailed, intelligent, and creative responses. Respond to the user's message in the language they use.
    
User message: ${input.message}
`,
      config: {
        temperature: 0.7,
      },
    });

    const response = llmResponse.text;

    if (!response) {
      return { response: "I'm sorry, I couldn't generate a response." };
    }

    return {
      response: response,
    };
  }
);
