
'use client';

import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { Todo } from '@/lib/types';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { motion } from 'framer-motion';

interface EditTaskDialogProps {
    todo: Todo;
    onEditTodo: (id: string, title: string) => void;
    onClose: () => void;
}

export default function EditTaskDialog({ todo, onEditTodo, onClose }: EditTaskDialogProps) {
    const [editedTitle, setEditedTitle] = useState(todo.title);

    const handleSave = () => {
        if (editedTitle.trim()) {
            onEditTodo(todo.id, editedTitle.trim());
            onClose();
        }
    };

    return (
        <DialogContent className="sm:max-w-lg bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 dark:from-yellow-900/70 dark:via-orange-900/70 dark:to-red-900/70 border-border shadow-2xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500">
                    <Edit className="h-7 w-7 text-orange-500" />
                    Edit Task
                </DialogTitle>
            </DialogHeader>
            <div className="py-4">
                <TextareaAutosize
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-lg bg-white/80 border-2 border-white/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 resize-none w-full rounded-lg py-3 px-4 text-gray-700 ring-offset-background placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-inner"
                    autoFocus
                    minRows={3}
                    maxRows={8}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSave();
                        }
                    }}
                />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button type="button" variant="ghost">
                            Cancel
                        </Button>
                    </motion.div>
                </DialogClose>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button type="button" onClick={handleSave} className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        Save Changes
                    </Button>
                </motion.div>
            </DialogFooter>
        </DialogContent>
    )
}
