'use server';

/**
 * @fileOverview An AI agent that summarizes the content of a PDF.
 *
 * - summarizePdf - Extracts text from PDF pages and generates a summary.
 * - SummarizePdfInput - The input type for the function.
 * - SummarizePdfOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePdfInputSchema = z.object({
  pageImagesDataUris: z.array(
    z
      .string()
      .describe(
        "An array of image data URIs, each representing a page of a PDF. The data URI must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      )
  ).describe('The PDF pages to be summarized.'),
});
export type SummarizePdfInput = z.infer<typeof SummarizePdfInputSchema>;

const SummarizePdfOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the key points and main information found in the document.'
    ),
});
export type SummarizePdfOutput = z.infer<typeof SummarizePdfOutputSchema>;

export async function summarizePdf(
  input: SummarizePdfInput
): Promise<SummarizePdfOutput> {
  return summarizePdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePdfPrompt',
  input: {schema: SummarizePdfInputSchema},
  output: {schema: SummarizePdfOutputSchema},
  prompt: `You are an expert document analyst. Your task is to carefully analyze a document, provided as a series of page images, and produce a concise summary.

First, perform OCR on the images to extract all the textual content. Then, read through the entire extracted text to understand the key topics, arguments, and conclusions.

Finally, generate a summary that captures the essential information of the document. The summary should be clear, concise, and easy to understand.

Input Pages:
{{#each pageImagesDataUris}}
Page {{@index}}: {{media url=this}}
{{/each}}
  `,
});

const summarizePdfFlow = ai.defineFlow(
  {
    name: 'summarizePdfFlow',
    inputSchema: SummarizePdfInputSchema,
    outputSchema: SummarizePdfOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
