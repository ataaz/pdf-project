"use client";

import React from 'react';
import type { PdfToExcelOutput } from '@/ai/flows/pdf-to-excel-flow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Table as TableIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as XLSX from 'xlsx';

interface TablePreviewProps {
  tables: PdfToExcelOutput['tables'] | undefined;
  isLoading: boolean;
  baseFileName: string;
}

export function TablePreview({ tables, isLoading, baseFileName }: TablePreviewProps) {
    const { toast } = useToast();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Extracting tables from PDF...</p>
            </div>
        )
    }

    if (!tables || tables.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Extracted tables will be displayed here.</p>
            </div>
        );
    }
    
    const handleDownload = (tableData: string[][], tableName: string) => {
        try {
            const worksheet = XLSX.utils.aoa_to_sheet(tableData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            
            const fileName = `${baseFileName}_${tableName.replace(/\s+/g, '_')}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            toast({ title: 'Download Started', description: `Downloading "${fileName}"` });
        } catch (err) {
            toast({ title: 'Download Failed', description: 'Could not generate the Excel file.', variant: 'destructive' });
        }
    };
    
    const handleDownloadAll = () => {
        try {
            const workbook = XLSX.utils.book_new();
            tables.forEach(table => {
                const worksheet = XLSX.utils.aoa_to_sheet(table.tableData);
                // Sanitize sheet name for Excel (max 31 chars, no special chars)
                const sheetName = table.tableName.replace(/[\\/*?:"<>|]/g, '').substring(0, 31);
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
            });
            const fileName = `${baseFileName}_all_tables.xlsx`;
            XLSX.writeFile(workbook, fileName);
            toast({ title: 'Download Started', description: `Downloading "${fileName}"` });
        } catch (err) {
             toast({ title: 'Download Failed', description: 'Could not generate the Excel file.', variant: 'destructive' });
        }
    };


    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-end">
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadAll}
                 >
                    <Download className="mr-2 h-4 w-4" /> Download All as XLSX
                </Button>
            </div>
            <ScrollArea className="flex-grow h-0 min-h-[400px]">
                <div className="space-y-6 pr-4">
                    {tables.map((table, index) => (
                        <Card key={index} className="shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <TableIcon size={18} /> {table.tableName}
                                    </CardTitle>
                                    <CardDescription>
                                        {table.tableData.length - 1} rows, {table.tableData[0]?.length || 0} columns
                                    </CardDescription>
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => handleDownload(table.tableData, table.tableName)}>
                                    <Download className="mr-2 h-4 w-4" /> Download
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="max-h-60 w-full overflow-auto border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {table.tableData[0]?.map((header, colIndex) => (
                                                    <TableHead key={colIndex}>{header}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {table.tableData.slice(1).map((row, rowIndex) => (
                                                <TableRow key={rowIndex}>
                                                    {row.map((cell, cellIndex) => (
                                                        <TableCell key={cellIndex}>{cell}</TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
