export interface UploadedImage {
  id: string;
  file: File;
  dataUrl: string;
  name: string;
}

export type PdfOrientation = 'portrait' | 'landscape';
export type PdfMargin = 'none' | 'small' | 'medium' | 'large';

export interface UploadedPdf {
  id: string;
  file: File;
  name: string;
}
