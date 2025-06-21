'use server';

/**
 * @fileOverview An AI agent that extracts tables from PDF pages and formats them for Excel.
 *
 * - extractTablesFromPdfImages - Extracts and formats tabular data from a series of images representing PDF pages.
 * - PdfToExcelInput - The input type for the function.
 * - PdfToExcelOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PdfToExcelInputSchema = z.object({
  pageImagesDataUris: z.array(
    z
      .string()
      .describe(
        "An array of image data URIs, each representing a page of a PDF. The data URI must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      )
  ).describe('The PDF pages to be processed.'),
});
export type PdfToExcelInput = z.infer<typeof PdfToExcelInputSchema>;

const TableSchema = z.object({
    tableName: z.string().describe('A descriptive name or title for the identified table.'),
    tableData: z.array(z.array(z.string())).describe('The table content, represented as a 2D array of strings (rows and columns). The first inner array should be the table headers.'),
});

const PdfToExcelOutputSchema = z.object({
  tables: z.array(TableSchema).describe('An array of all tables found in the document.'),
});
export type PdfToExcelOutput = z.infer<typeof PdfToExcelOutputSchema>;

export async function extractTablesFromPdfImages(
  input: PdfToExcelInput
): Promise<PdfToExcelOutput> {
  return pdfToExcelFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pdfToExcelPrompt',
  input: {schema: PdfToExcelInputSchema},
  output: {schema: PdfToExcelOutputSchema},
  prompt: `You are an expert data extractor specializing in identifying and parsing tables from documents. Your task is to convert a document, provided as a series of page images, into a structured format containing all the tables found within it.

  Analyze the following images, which represent the pages of a PDF document in sequence. Carefully identify every table. For each table you find:
  1.  Give it a descriptive name. If the table has a title or caption, use that. Otherwise, create a name like "Table 1", "Table 2", etc.
  2.  Extract all its data, including headers, and represent it as a two-dimensional array of strings, where each inner array is a row. The first row must be the header row.

  Combine all found tables into a single JSON output. If no tables are found, return an empty array for the 'tables' field.

  Input Pages:
  {{#each pageImagesDataUris}}
  Page {{@index}}: {{media url=this}}
  {{/each}}
  `,
});

const pdfToExcelFlow = ai.defineFlow(
  {
    name: 'pdfToExcelFlow',
    inputSchema: PdfToExcelInputSchema,
    outputSchema: PdfToExcelOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
