
"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ShieldCheck, Gem } from 'lucide-react';

export type CompressionLevel = 'recommended' | 'high' | 'low';

interface CompressionSettingsProps {
  level: CompressionLevel;
  onLevelChange: (level: CompressionLevel) => void;
  disabled?: boolean;
  className?: string;
}

const levelOptions: { value: CompressionLevel; label: string; description: string; icon: React.ElementType }[] = [
    { value: 'recommended', label: 'Recommended', description: 'Good compression and good quality.', icon: Star },
    { value: 'high', label: 'High Quality', description: 'Less compression, better quality.', icon: Gem },
    { value: 'low', label: 'Smallest Size', description: 'Lowest quality, highest compression.', icon: ShieldCheck },
];

export function CompressionSettings({ level, onLevelChange, disabled, className }: CompressionSettingsProps) {
  return (
    <Card className={className} data-disabled={disabled ? '' : undefined}>
      <CardHeader>
        <CardTitle className="text-xl">Compression Level</CardTitle>
        <CardDescription>Choose how much you want to compress your PDF.</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={level}
          onValueChange={(value) => onLevelChange(value as CompressionLevel)}
          className="space-y-2"
          disabled={disabled}
        >
          {levelOptions.map((option) => (
            <Label
              key={option.value}
              htmlFor={`level-${option.value}`}
              className="flex items-center gap-4 p-3 border rounded-md cursor-pointer hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 transition-all has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70 has-[:disabled]:hover:border-border"
              data-state={level === option.value ? 'checked' : 'unchecked'}
            >
              <RadioGroupItem value={option.value} id={`level-${option.value}`} className="sr-only" />
              <option.icon className="h-6 w-6 text-muted-foreground data-[state=checked]:text-primary" data-state={level === option.value ? 'checked' : 'unchecked'} />
              <div>
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </Label>
          ))}
        </RadioGroup>
        <p className="text-xs text-muted-foreground mt-4">
            Note: Advanced image compression is not yet available. This setting primarily optimizes the PDF structure.
        </p>
      </CardContent>
    </Card>
  );
}
