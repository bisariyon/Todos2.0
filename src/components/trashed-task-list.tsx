
'use client';

import type { Todo } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import TrashedTaskListItem from './trashed-task-list-item';

interface TrashedTaskListProps {
  todos: Todo[];
  onRestoreTodo: (id: string) => void;
  onPermanentDelete: (id: string) => void;
  emptyMessage?: string;
}

export default function TrashedTaskList({ 
  todos, 
  onRestoreTodo,
  onPermanentDelete,
  emptyMessage = "No tasks in trash.",
}: TrashedTaskListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-16 bg-white/30 backdrop-blur-sm rounded-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <Trash2 className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg text-gray-500 font-semibold">{emptyMessage}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-6")}>
      <AnimatePresence>
        {todos.map((todo) => {
          const animationProps = {
              layout: true,
              initial: { opacity: 0, y: 50, scale: 0.3 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
              transition: { type: 'spring', stiffness: 500, damping: 30 }
          };

          return (
            <motion.div key={todo.id} {...animationProps}>
              <TrashedTaskListItem
                todo={todo}
                onRestoreTodo={onRestoreTodo}
                onPermanentDelete={onPermanentDelete}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  );
}
