'use server';

/**
 * @fileOverview An AI agent that performs Optical Character Recognition (OCR) on PDF pages.
 *
 * - ocrPdfImages - Extracts text and its position from a series of images representing PDF pages.
 * - OcrPdfInput - The input type for the function.
 * - OcrPdfOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const OcrPdfInputSchema = z.object({
  pageImagesDataUris: z.array(
    z
      .string()
      .describe(
        "An array of image data URIs, each representing a page of a PDF. The data URI must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      )
  ).describe('The PDF pages to be processed.'),
});
export type OcrPdfInput = z.infer<typeof OcrPdfInputSchema>;

const WordSchema = z.object({
    text: z.string().describe("The recognized word or text fragment."),
    bbox: z.object({
      x: z.number().describe("The x-coordinate of the top-left corner of the bounding box."),
      y: z.number().describe("The y-coordinate of the top-left corner of the bounding box."),
      width: z.number().describe("The width of the bounding box."),
      height: z.number().describe("The height of the bounding box."),
    }).describe("The bounding box for the text fragment. All coordinates are in pixels relative to the image dimensions.")
});

const PageOcrSchema = z.object({
    imageWidth: z.number().describe("The original width of the source page image in pixels."),
    imageHeight: z.number().describe("The original height of the source page image in pixels."),
    words: z.array(WordSchema).describe("An array of all text fragments found on the page."),
});

export const OcrPdfOutputSchema = z.object({
  pages: z.array(PageOcrSchema).describe('An array of OCR results for each page.'),
});
export type OcrPdfOutput = z.infer<typeof OcrPdfOutputSchema>;


export async function ocrPdfImages(
  input: OcrPdfInput
): Promise<OcrPdfOutput> {
  return ocrPdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ocrPdfPrompt',
  input: {schema: OcrPdfInputSchema},
  output: {schema: OcrPdfOutputSchema},
  prompt: `You are a highly accurate OCR engine. Your task is to analyze the provided images, which represent pages of a document, and extract all text content along with its precise location.

For each page image you process, you must:
1.  Identify the image's dimensions (width and height) in pixels.
2.  Detect every individual word or coherent text fragment on the page.
3.  For each fragment, determine its exact bounding box (x, y, width, height) in pixels, with the origin (0,0) at the top-left corner of the image.
4.  Return the results structured according to the provided JSON schema. Ensure all detected text is included.

Do not summarize or interpret the text. Your only job is to perform OCR and provide the text and its coordinates.

Input Pages:
{{#each pageImagesDataUris}}
Page {{@index}}: {{media url=this}}
{{/each}}
  `,
});

const ocrPdfFlow = ai.defineFlow(
  {
    name: 'ocrPdfFlow',
    inputSchema: OcrPdfInputSchema,
    outputSchema: OcrPdfOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
