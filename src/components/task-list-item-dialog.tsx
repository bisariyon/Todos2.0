
'use client';

import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Todo } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TaskListItemDialogProps {
    todo: Todo;
}

export default function TaskListItemDialog({ todo }: TaskListItemDialogProps) {
    return (
        <DialogContent className="sm:max-w-lg bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 dark:from-green-900/70 dark:via-teal-900/70 dark:to-blue-900/70 border-border shadow-2xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-500 to-green-400">
                    <Eye className="h-7 w-7 text-primary" />
                    Task Details
                </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] w-full pr-4">
                <Card className="bg-transparent border-none shadow-none">
                    <CardContent className="p-1">
                        <p className={cn("text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap break-words")}>
                            {todo.title}
                        </p>
                    </CardContent>
                </Card>
            </ScrollArea>
        </DialogContent>
    )
}
