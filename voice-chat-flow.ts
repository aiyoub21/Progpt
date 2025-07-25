'use server';
/**
 * @fileOverview A flow for handling voice chat interactions.
 * It takes a user's text message, gets a text response from a chat model,
 * and then synthesizes that text into speech.
 *
 * - voiceChat - The main function for the voice chat interaction.
 * - VoiceChatInput - The input type for the voiceChat function.
 * - VoiceChatOutput - The return type for the voiceChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { chat } from './chat-flow';
import { googleAI } from '@genkit-ai/googleai';
import wav from 'wav';

export const VoiceChatInputSchema = z.object({
  message: z.string().describe('The user message transcribed from speech.'),
});
export type VoiceChatInput = z.infer<typeof VoiceChatInputSchema>;

export const VoiceChatOutputSchema = z.object({
  textResponse: z.string().describe('The AI-generated text response.'),
  audioUrl: z.string().describe('The data URI of the generated speech audio.'),
});
export type VoiceChatOutput = z.infer<typeof VoiceChatOutputSchema>;


export async function voiceChat(input: VoiceChatInput): Promise<VoiceChatOutput> {
  return voiceChatFlow(input);
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

const voiceChatFlow = ai.defineFlow(
  {
    name: 'voiceChatFlow',
    inputSchema: VoiceChatInputSchema,
    outputSchema: VoiceChatOutputSchema,
  },
  async ({ message }) => {
    // 1. Get text response from the chat model
    const chatResponse = await chat({ message });

    if (!chatResponse || !chatResponse.response) {
      throw new Error("Failed to get a text response from the chat model.");
    }
    const textResponse = chatResponse.response;

    // 2. Synthesize the text response to speech
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        prompt: textResponse,
        config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Algenib' },
                },
            },
        },
    });

    if (!media) {
      throw new Error('No audio media returned from TTS model');
    }

    // 3. Convert PCM audio data to WAV format
    const pcmData = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const audioWavBase64 = await toWav(pcmData);

    return {
      textResponse,
      audioUrl: `data:audio/wav;base64,${audioWavBase64}`,
    };
  }
);
