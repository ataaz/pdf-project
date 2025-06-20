// 'use server';

/**
 * @fileOverview An AI agent that suggests the best layout and orientation for images to be converted to PDF.
 *
 * - aiEnhancedLayoutSuggestion - A function that suggests the best layout and orientation for images.
 * - AiEnhancedLayoutInput - The input type for the aiEnhancedLayoutSuggestion function.
 * - AiEnhancedLayoutOutput - The return type for the aiEnhancedLayoutSuggestion function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiEnhancedLayoutInputSchema = z.object({
  imageDataUris: z.array(
    z
      .string()
      .describe(
        "An array of image data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      )
  ).describe('The images to be converted to PDF.'),
});
export type AiEnhancedLayoutInput = z.infer<typeof AiEnhancedLayoutInputSchema>;

const AiEnhancedLayoutOutputSchema = z.object({
  suggestedLayout: z
    .string()
    .describe(
      'A textual description of the suggested layout and orientation for the images, e.g., portrait or landscape.'
    ),
  reasoning: z
    .string()
    .describe(
      'The AI agents reasoning for suggesting this layout, citing any properties or features of the images that influenced its decision.'
    ),
});
export type AiEnhancedLayoutOutput = z.infer<typeof AiEnhancedLayoutOutputSchema>;

export async function aiEnhancedLayoutSuggestion(
  input: AiEnhancedLayoutInput
): Promise<AiEnhancedLayoutOutput> {
  return aiEnhancedLayoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiEnhancedLayoutPrompt',
  input: {schema: AiEnhancedLayoutInputSchema},
  output: {schema: AiEnhancedLayoutOutputSchema},
  prompt: `You are an AI expert in document layout and design. Given a set of images, you will analyze their content and
  suggest the best layout and orientation for converting them to a PDF document. Consider factors such as image dimensions,
  aspect ratio, content (e.g., predominantly text or images), and the overall visual harmony when arranged in a document.

  Input Images:
  {{#each imageDataUris}}
  Image {{@index}}: {{media url=this}}
  {{/each}}

  Provide a suggestion for the overall layout, including whether the document should be in portrait or landscape orientation.
  Explain the reasoning behind your suggestion, citing specific characteristics of the images that influenced your decision. For example,
  if most images are tall and narrow, suggest portrait orientation. If they are wide and short, suggest landscape. If the images have
  varying dimensions and content, suggest a layout that balances visual appeal and readability.

  Output your suggestion and reasoning in the format specified by the schema.
  `,
});

const aiEnhancedLayoutFlow = ai.defineFlow(
  {
    name: 'aiEnhancedLayoutFlow',
    inputSchema: AiEnhancedLayoutInputSchema,
    outputSchema: AiEnhancedLayoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
