// src/ai/flows/suggest-color-harmony.ts
'use server';

/**
 * @fileOverview Provides color harmony suggestions based on a given color.
 *
 * - suggestColorHarmony - A function that takes a color and returns a suggested color harmony.
 * - SuggestColorHarmonyInput - The input type for the suggestColorHarmony function.
 * - SuggestColorHarmonyOutput - The return type for the suggestColorHarmony function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestColorHarmonyInputSchema = z.object({
  favoriteColor: z
    .string()
    .describe('The user\u0027s favorite color, in hex format (e.g., #FF0000).'),
});
export type SuggestColorHarmonyInput = z.infer<typeof SuggestColorHarmonyInputSchema>;

const SuggestColorHarmonyOutputSchema = z.object({
  harmonySuggestion: z
    .string()
    .describe(
      'A suggestion for a color harmony (e.g., complementary, analogous) that works well with the favorite color.'
    ),
});
export type SuggestColorHarmonyOutput = z.infer<typeof SuggestColorHarmonyOutputSchema>;

export async function suggestColorHarmony(input: SuggestColorHarmonyInput): Promise<SuggestColorHarmonyOutput> {
  return suggestColorHarmonyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestColorHarmonyPrompt',
  input: {schema: SuggestColorHarmonyInputSchema},
  output: {schema: SuggestColorHarmonyOutputSchema},
  prompt: `You are a color palette expert. Given a user's favorite color, you will suggest a color harmony (e.g., complementary, analogous) that works well with the favorite color.

  Favorite Color: {{{favoriteColor}}}

  Suggest a color harmony that complements the user's favorite color. Return only the name of the color harmony.
  `,
});

const suggestColorHarmonyFlow = ai.defineFlow(
  {
    name: 'suggestColorHarmonyFlow',
    inputSchema: SuggestColorHarmonyInputSchema,
    outputSchema: SuggestColorHarmonyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
