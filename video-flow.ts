'use server';
/**
 * @fileOverview A flow for generating video and audio from a text prompt.
 * It can optionally take an image as a reference for video generation.
 *
 * - generateVideo - A function that handles the video and audio generation process.
 * - GenerateVideoInput - The input type for the generateVideo function.
 * - GenerateVideoOutput - The return type for the generateVideo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { Readable } from 'stream';
import wav from 'wav';
import { MediaPart, MessageData } from 'genkit';

export const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the video and audio from.'),
  photoDataUri: z.string().optional().describe("An optional reference photo for the video, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

export const GenerateVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video file.'),
  audioUrl: z.string().describe('The data URI of the generated audio file.'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
  return generateVideoFlow(input);
}

async function toWav(pcmData: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels: 1,
      sampleRate: 24000,
      bitDepth: 16,
    });
    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
    writer.write(pcmData);
    writer.end();
  });
}

async function downloadVideo(video: MediaPart): Promise<string> {
  const fetch = (await import('node-fetch')).default;
  const url = `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }
  
  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:video/mp4;base64,${base64}`;
}


const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async ({ prompt, photoDataUri }) => {
    
    const videoPrompt: MessageData = [{ text: prompt }];
    if (photoDataUri) {
        videoPrompt.push({ media: { url: photoDataUri } });
    }

    const [videoGen, audioGen] = await Promise.all([
      // Video generation
      ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt: videoPrompt,
        config: {
          durationSeconds: 8,
          aspectRatio: '16:9',
        },
      }),
      // Audio generation
      ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        prompt,
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Algenib' },
                },
            },
        },
      }),
    ]);
    
    // Process video operation
    let videoOperation = videoGen.operation;
    if (!videoOperation) {
        throw new Error('Expected the model to return a video operation');
    }

    while (!videoOperation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        videoOperation = await ai.checkOperation(videoOperation);
    }

    if (videoOperation.error) {
        throw new Error('Failed to generate video: ' + videoOperation.error.message);
    }
    const videoPart = videoOperation.output?.message?.content.find(p => !!p.media);
    if (!videoPart) {
        throw new Error('Failed to find the generated video in operation result');
    }
    
    // Process audio result
    const audioMedia = audioGen.media;
     if (!audioMedia) {
      throw new Error('No audio media returned');
    }

    // Download video and convert audio
    const pcmData = Buffer.from(audioMedia.url.substring(audioMedia.url.indexOf(',') + 1), 'base64');
    const [videoUrl, audioWav] = await Promise.all([
        downloadVideo(videoPart),
        toWav(pcmData),
    ]);

    return {
      videoUrl,
      audioUrl: `data:audio/wav;base64,${audioWav}`,
    };
  }
);
