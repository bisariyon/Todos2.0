
'use client';

import type { Todo } from '@/lib/types';
import TaskListItem from './task-list-item';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Rocket } from 'lucide-react';

interface TaskListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, title: string) => void;
  title?: string;
  emptyMessage?: string;
}

export default function TaskList({ 
  todos, 
  onToggleTodo, 
  onDeleteTodo, 
  onEditTodo, 
  title, 
  emptyMessage = "No tasks yet!",
}: TaskListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-16 bg-white/30 backdrop-blur-sm rounded-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <Rocket className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg text-gray-500 font-semibold">{emptyMessage}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {title && <h2 className="text-xl font-bold mb-4 px-1 text-gray-700">{title}</h2>}
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6")}>
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
                <TaskListItem
                  todo={todo}
                  onToggleTodo={onToggleTodo}
                  onDeleteTodo={onDeleteTodo}
                  onEditTodo={onEditTodo}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
