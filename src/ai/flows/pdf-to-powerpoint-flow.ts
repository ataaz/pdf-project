'use server';

/**
 * @fileOverview An AI agent that converts PDF pages into a structured presentation format.
 *
 * - extractSlidesFromPdfImages - Extracts presentation slides from a series of images representing PDF pages.
 * - PdfToPowerpointInput - The input type for the function.
 * - PdfToPowerpointOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const PdfToPowerpointInputSchema = z.object({
  pageImagesDataUris: z.array(
    z
      .string()
      .describe(
        "An array of image data URIs, each representing a page of a PDF. The data URI must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      )
  ).describe('The PDF pages to be processed.'),
});
export type PdfToPowerpointInput = z.infer<typeof PdfToPowerpointInputSchema>;

const SlideSchema = z.object({
    title: z.string().describe('The title for the slide.'),
    content: z.array(z.string()).describe('An array of strings, where each string is a bullet point for the slide body.'),
    speakerNotes: z.string().describe('Speaker notes or additional details for the presenter.'),
});

export const PdfToPowerpointOutputSchema = z.object({
  slides: z.array(SlideSchema).describe('An array of slide objects, each representing a slide in the presentation.'),
});
export type PdfToPowerpointOutput = z.infer<typeof PdfToPowerpointOutputSchema>;

export async function extractSlidesFromPdfImages(
  input: PdfToPowerpointInput
): Promise<PdfToPowerpointOutput> {
  return pdfToPowerpointFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pdfToPowerpointPrompt',
  input: {schema: PdfToPowerpointInputSchema},
  output: {schema: PdfToPowerpointOutputSchema},
  prompt: `You are an expert at creating engaging presentations. Your task is to convert a document, provided as a series of page images, into a structured PowerPoint presentation format.

  Analyze the following images, which represent the pages of a document in sequence. For each page or logical section, create a corresponding slide.

  For each slide, you must:
  1.  Create a concise and compelling title that captures the main topic of the page.
  2.  Extract the key information and summarize it into several bullet points for the slide's content.
  3.  Generate relevant speaker notes that provide more detail, context, or talking points for the presenter.

  The final output must be a JSON object containing an array of these structured slides.

  Input Pages:
  {{#each pageImagesDataUris}}
  Page {{@index}}: {{media url=this}}
  {{/each}}
  `,
});

const pdfToPowerpointFlow = ai.defineFlow(
  {
    name: 'pdfToPowerpointFlow',
    inputSchema: PdfToPowerpointInputSchema,
    outputSchema: PdfToPowerpointOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
