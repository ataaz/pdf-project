"use client";

import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoveUpLeft, MoveUp, MoveUpRight, MoveDownLeft, MoveDown, MoveDownRight } from 'lucide-react';

export type PageNumberPosition = 'top_left' | 'top_center' | 'top_right' | 'bottom_left' | 'bottom_center' | 'bottom_right';

export interface PageNumberSettings {
  position: PageNumberPosition;
  margin: number;
  fontSize: number;
  fontColor: string;
  format: string;
}

interface NumberSettingsProps {
  settings: PageNumberSettings;
  onSettingsChange: (settings: PageNumberSettings) => void;
  disabled?: boolean;
}

const positionOptions: { value: PageNumberPosition; label: string; icon: React.ElementType }[] = [
    { value: 'top_left', label: 'Top Left', icon: MoveUpLeft },
    { value: 'top_center', label: 'Top Center', icon: MoveUp },
    { value: 'top_right', label: 'Top Right', icon: MoveUpRight },
    { value: 'bottom_left', label: 'Bottom Left', icon: MoveDownLeft },
    { value: 'bottom_center', label: 'Bottom Center', icon: MoveDown },
    { value: 'bottom_right', label: 'Bottom Right', icon: MoveDownRight },
];

export function NumberSettings({ settings, onSettingsChange, disabled }: NumberSettingsProps) {
  
  const updateSetting = <K extends keyof PageNumberSettings>(key: K, value: PageNumberSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };
  
  return (
    <Card data-disabled={disabled ? '' : undefined} className="has-[:disabled]:opacity-70">
      <CardHeader>
        <CardTitle className="text-xl">Numbering Options</CardTitle>
        <CardDescription>Customize the appearance of your page numbers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="font-semibold mb-2 block">Position</Label>
          <RadioGroup
            value={settings.position}
            onValueChange={(value) => updateSetting('position', value as PageNumberPosition)}
            className="grid grid-cols-3 gap-2"
            disabled={disabled}
          >
            {positionOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={`pos-${option.value}`}
                className="flex flex-col items-center justify-center p-3 border rounded-md cursor-pointer hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 transition-all has-[:disabled]:cursor-not-allowed"
                data-state={settings.position === option.value ? 'checked' : 'unchecked'}
              >
                <RadioGroupItem value={option.value} id={`pos-${option.value}`} className="sr-only" />
                <option.icon className="h-5 w-5 mb-1 text-muted-foreground data-[state=checked]:text-primary" data-state={settings.position === option.value ? 'checked' : 'unchecked'} />
                <span className="text-xs text-center">{option.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="margin">Margin (pixels from edge)</Label>
            <Slider 
                id="margin"
                value={[settings.margin]} 
                onValueChange={(v) => updateSetting('margin', v[0])} 
                min={10} max={100} step={5} 
                disabled={disabled}
            />
        </div>

        <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={settings.format} onValueChange={(v) => updateSetting('format', v)} disabled={disabled}>
                <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Page {page} of {total}">Page 1 of 10</SelectItem>
                    <SelectItem value="{page} / {total}">1 / 10</SelectItem>
                    <SelectItem value="{page}">{`1`}</SelectItem>
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{"{page} = current page, {total} = total pages"}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Input id="font-size" type="number" value={settings.fontSize} onChange={(e) => updateSetting('fontSize', Number(e.target.value))} disabled={disabled} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="font-color">Color</Label>
                <Input id="font-color" type="color" value={settings.fontColor} onChange={(e) => updateSetting('fontColor', e.target.value)} className="p-1 h-10" disabled={disabled}/>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
