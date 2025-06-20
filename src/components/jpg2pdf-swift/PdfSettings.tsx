"use client";

import React from 'react';
import { PdfOrientation, PdfMargin } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PanelTop, PanelLeft, Columns,Rows, Minus, Expand } from 'lucide-react'; // Placeholder icons for margins

interface PdfSettingsProps {
  orientation: PdfOrientation;
  onOrientationChange: (orientation: PdfOrientation) => void;
  margin: PdfMargin;
  onMarginChange: (margin: PdfMargin) => void;
  className?: string;
}

const orientationOptions: { value: PdfOrientation; label: string; icon: React.ElementType }[] = [
  { value: 'portrait', label: 'Portrait', icon: PanelTop },
  { value: 'landscape', label: 'Landscape', icon: PanelLeft },
];

const marginOptions: { value: PdfMargin; label: string; icon: React.ElementType }[] = [
  { value: 'none', label: 'None', icon: Minus },
  { value: 'small', label: 'Small', icon: Columns },
  { value: 'medium', label: 'Medium', icon: Rows },
  { value: 'large', label: 'Large', icon: Expand },
];

export function PdfSettings({
  orientation,
  onOrientationChange,
  margin,
  onMarginChange,
  className,
}: PdfSettingsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">PDF Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-semibold mb-2 block">Page Orientation</Label>
          <RadioGroup
            value={orientation}
            onValueChange={(value) => onOrientationChange(value as PdfOrientation)}
            className="flex space-x-2 sm:space-x-4"
          >
            {orientationOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={`orientation-${option.value}`}
                className="flex flex-col items-center space-y-1 p-3 border rounded-md cursor-pointer hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 transition-all w-full"
                data-state={orientation === option.value ? 'checked' : 'unchecked'}
              >
                <RadioGroupItem value={option.value} id={`orientation-${option.value}`} className="sr-only" />
                <option.icon className="h-6 w-6 mb-1 text-muted-foreground data-[state=checked]:text-primary" data-state={orientation === option.value ? 'checked' : 'unchecked'} />
                <span className="text-sm">{option.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
        <div>
          <Label className="text-base font-semibold mb-2 block">Margins</Label>
          <RadioGroup
            value={margin}
            onValueChange={(value) => onMarginChange(value as PdfMargin)}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4"
          >
            {marginOptions.map((option) => (
               <Label
                key={option.value}
                htmlFor={`margin-${option.value}`}
                className="flex flex-col items-center space-y-1 p-3 border rounded-md cursor-pointer hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 transition-all"
                data-state={margin === option.value ? 'checked' : 'unchecked'}
              >
                <RadioGroupItem value={option.value} id={`margin-${option.value}`} className="sr-only" />
                <option.icon className="h-5 w-5 mb-1 text-muted-foreground data-[state=checked]:text-primary" data-state={margin === option.value ? 'checked' : 'unchecked'} />
                <span className="text-xs">{option.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
