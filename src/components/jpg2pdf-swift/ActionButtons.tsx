"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  onConvertAndDownload: () => Promise<void>;
  isConverting: boolean;
  canConvert: boolean;
  className?: string;
  buttonText?: string;
  convertingText?: string;
}

export function ActionButtons({
  onConvertAndDownload,
  isConverting,
  canConvert,
  className,
  buttonText = 'Convert to PDF & Download',
  convertingText = 'Converting...',
}: ActionButtonsProps) {
  return (
    <div className={className}>
      <Button
        onClick={onConvertAndDownload}
        disabled={isConverting || !canConvert}
        className="w-full text-lg py-6"
        size="lg"
      >
        {isConverting ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Download className="mr-2 h-5 w-5" />
        )}
        {isConverting ? convertingText : buttonText}
      </Button>
    </div>
  );
}
