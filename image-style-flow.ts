
'use server';
/**
 * @fileOverview A flow for generating images from a text prompt, optionally with a reference image.
 *
 * - generateImages - A function that takes a prompt and returns multiple images.
 * - GenerateImageInput - The input type for the function.
 * - GenerateImageOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text description of the image to generate, e.g., "professional headshot for LinkedIn".'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional reference photo, as a data URI. This is used to guide the generation, for example, to create a professional look of the person in the photo. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
  imageUrls: z.array(z.string()).describe('An array of data URIs for the generated images.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImages(
  input: GenerateImageInput
): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async ({ prompt, photoDataUri }) => {
    
    // Construct the prompt for the model.
    // If a photo is provided, the prompt will guide the model to use the photo as a reference.
    const imagePrompt: (string | {text: string} | {media: {url: string}})[] = [];
    
    if (photoDataUri) {
        imagePrompt.push({ media: { url: photoDataUri } });
        imagePrompt.push({ text: `Using the provided image as a reference for the person's face and appearance, generate a new image based on the following description: ${prompt}. Ensure the person's likeness is maintained.` });
    } else {
        imagePrompt.push(prompt);
    }
    
    // Generate 16 images in parallel to give the user options.
    const imagePromises = Array(16).fill(null).map(() => 
        ai.generate({
          model: googleAI.model('gemini-2.0-flash-preview-image-generation'),
          prompt: imagePrompt,
          config: {
            responseModalities: ['IMAGE'],
          },
        })
    );

    const results = await Promise.all(imagePromises);
    
    const imageUrls = results.map(result => {
        const imageUrl = result.media?.url;
        if (!imageUrl) {
          throw new Error('Image generation failed for one or more images. The model may not have been able to fulfill the request.');
        }
        return imageUrl;
    });

    return { imageUrls };
  }
);
