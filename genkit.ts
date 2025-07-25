/**
 * @fileoverview This file initializes and configures the Genkit AI system.
 * It sets up the necessary plugins, such as Google AI, and exports a
 * configured `ai` object for use throughout the application. This centralized
 * setup ensures that all Genkit functionalities (flows, prompts, etc.)
 * use a consistent configuration.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiVersion: 'v1beta'})],
});
