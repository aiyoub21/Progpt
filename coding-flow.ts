
'use server';
/**
 * @fileOverview A flow for generating code based on user prompts, with optional image analysis.
 *
 * - generateCode - A function that takes a prompt and an optional image and returns generated code.
 * - GenerateCodeInput - The input type for the function.
 * - GenerateCodeOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { gemini15Pro } from '@genkit-ai/googleai';
import { MessageData } from 'genkit';

export const GenerateCodeInputSchema = z.object({
  prompt: z.string().describe('The user\'s request for code generation.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional reference photo (e.g., a screenshot of a UI) to guide code generation. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

export const GenerateCodeOutputSchema = z.object({
  code: z.string().describe('The generated code, formatted in Markdown.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(
  input: GenerateCodeInput
): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async ({ prompt, photoDataUri }) => {

    const systemPrompt = `You are an expert software developer and coding assistant named "Progpt Code Assistant".
- Your primary goal is to help users by providing clean, efficient, and well-explained code.
- Always wrap the generated code in Markdown code blocks with the correct language identifier (e.g., \`\`\`javascript).
- If the user provides an image, analyze it carefully to understand the context. For example, if it's a UI mockup, generate the corresponding HTML/CSS or React/Vue/Svelte component.
- If the request is ambiguous, ask clarifying questions.
- Provide explanations for your code, but keep them concise.
- If you are generating a full component or page (e.g., in React or Next.js), provide all the necessary imports.
`;

    const messages: MessageData = [{ role: 'system', content: [{ text: systemPrompt }] }];
    
    const userContent: MessageData[0]['content'] = [{ text: prompt }];

    if (photoDataUri) {
      userContent.push({ media: { url: photoDataUri } });
    }
    
    messages.push({ role: 'user', content: userContent });
    
    const llmResponse = await ai.generate({
      model: gemini15Pro,
      messages: messages,
      config: {
        temperature: 0.2, // Lower temperature for more predictable code
      },
      output: {
        format: 'text',
      },
    });

    const responseText = llmResponse.text;
    if (!responseText) {
      throw new Error("The model did not return any code.");
    }

    return { code: responseText };
  }
);
