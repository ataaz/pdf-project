'use server';

/**
 * @fileOverview An AI agent that extracts content from PDF pages and formats it as Markdown.
 *
 * - extractContentFromPdfImages - Extracts and formats content from a series of images representing PDF pages.
 * - PdfToWordInput - The input type for the function.
 * - PdfToWordOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PdfToWordInputSchema = z.object({
  pageImagesDataUris: z.array(
    z
      .string()
      .describe(
        "An array of image data URIs, each representing a page of a PDF. The data URI must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      )
  ).describe('The PDF pages to be processed.'),
});
export type PdfToWordInput = z.infer<typeof PdfToWordInputSchema>;

const PdfToWordOutputSchema = z.object({
  extractedContent: z
    .string()
    .describe(
      'The full content of the document, extracted and formatted in Markdown. This should include headings, paragraphs, lists, tables, and other structural elements found in the original document.'
    ),
});
export type PdfToWordOutput = z.infer<typeof PdfToWordOutputSchema>;

export async function extractContentFromPdfImages(
  input: PdfToWordInput
): Promise<PdfToWordOutput> {
  return pdfToWordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pdfToWordPrompt',
  input: {schema: PdfToWordInputSchema},
  output: {schema: PdfToWordOutputSchema},
  prompt: `You are an expert data extractor and document processor. Your task is to convert a document, provided as a series of page images, into a single, well-formatted Markdown text file.

  Analyze the following images, which represent the pages of a PDF document in sequence. Perform OCR and identify all textual content, including headings, paragraphs, bullet points, numbered lists, tables, and any other structural elements.

  Reconstruct the document's content and layout using Markdown syntax. Pay close attention to maintaining the original structure. For example, use '#' for headings, '*' or '-' for list items, and Markdown table syntax for tables.

  The final output should be a single string containing the complete, formatted Markdown.

  Input Pages:
  {{#each pageImagesDataUris}}
  Page {{@index}}: {{media url=this}}
  {{/each}}
  `,
});

const pdfToWordFlow = ai.defineFlow(
  {
    name: 'pdfToWordFlow',
    inputSchema: PdfToWordInputSchema,
    outputSchema: PdfToWordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
