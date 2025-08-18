
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { getEnhancedTask } from '@/app/actions';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface AddTaskFormProps {
  onAddTask: (title: string) => void;
}

export default function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim());
      setTitle('');
    }
  };

  const handleEnhance = async () => {
    if (!title.trim()) return;
    setIsEnhancing(true);
    try {
      const { enhancedTitle } = await getEnhancedTask({ title });
      setTitle(enhancedTitle);
      toast({
        title: "✨ Task Refined!",
        description: "Your task has been enhanced with AI magic.",
      });
    } catch (error) {
        console.error("Failed to enhance task:", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Couldn't connect to the AI. Please try again.",
        });
    } finally {
        setIsEnhancing(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
            <TextareaAutosize
                placeholder="e.g., Plan a trip to the mountains 🌲"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                    }
                }}
                className={cn(
                    'flex-grow text-lg bg-white/80 border-2 border-white/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 resize-none w-full rounded-lg py-3 px-4 pr-28 text-gray-700 ring-offset-background placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-inner'
                )}
                aria-label="New task title"
                minRows={1}
                maxRows={5}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                    <Button type="button" variant="ghost" size="icon" onClick={handleEnhance} disabled={!title.trim() || isEnhancing} className="rounded-full h-10 w-10 hover:bg-yellow-300/50 text-yellow-500">
                        <Sparkles className={`h-6 w-6 ${isEnhancing ? 'animate-pulse' : ''}`} />
                    </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button type="submit" aria-label="Add task" disabled={!title.trim()} className="rounded-full bg-gradient-to-br from-green-500 to-teal-500 h-11 w-11 p-0 text-white shadow-lg transition-all active:scale-100 transform active:translate-y-px">
                      <Plus className="h-6 w-6" />
                  </Button>
                </motion.div>
            </div>
        </div>
    </form>
  );
}
