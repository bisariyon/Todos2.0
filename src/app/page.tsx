
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Todo } from '@/lib/types';
import AddTaskForm from '@/components/add-task-form';
import TaskList from '@/components/task-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Trash2, Shuffle } from 'lucide-react';
import TrashedTaskList from '@/components/trashed-task-list';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialTodos: Todo[] = [
  { id: '1', title: 'Update my Future Billionaire vision board 💼🚀', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), colorKey: Math.random() },
  { id: '2', title: 'Organize desk so it looks like a Pinterest post 📌✨', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), colorKey: Math.random() },
  { id: '3', title: 'Conquer Mount Laundry 🏔️👕', completed: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), colorKey: Math.random() },
  { id: '4', title: 'Water the plants before they file a complaint 🌱💧', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), colorKey: Math.random() },
];


export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        if(parsedTodos.length === 0) {
            setTodos(initialTodos);
        } else {
            setTodos(parsedTodos.map((todo: any) => ({...todo, colorKey: todo.colorKey ?? Math.random() })));
        }
      } else {
        setTodos(initialTodos);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      setTodos(initialTodos);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.error("Failed to save to localStorage", error);
    }
  }, [todos]);

  const addTodo = (title: string) => {
    if (title.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      colorKey: Math.random(),
    };
    setTodos([newTodo, ...todos]);
  };
  
  const editTodo = (id: string, title: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, title, updatedAt: new Date().toISOString() } : todo
      )
    );
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    if (!todoToDelete) return;

    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, deletedAt: new Date().toISOString() } : todo
      )
    );

    const truncatedTitle = todoToDelete.title.length > 40 ? todoToDelete.title.substring(0, 40) + '...' : todoToDelete.title;

    toast({
      title: "Task moved to trash",
      description: `"${truncatedTitle}" will be permanently deleted soon.`,
      duration: 3000,
    });
  };

  const restoreTodo = (id: string) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          const { deletedAt, ...rest } = todo;
          return { ...rest, updatedAt: new Date().toISOString() };
        }
        return todo;
      })
    );
  };

  const permanentDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const shuffleColors = () => {
    setTodos(todos.map(todo => ({ ...todo, colorKey: Math.random() })));
  }


  const pendingTodos = useMemo(() => todos.filter(todo => !todo.completed && !todo.deletedAt).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [todos]);
  const completedTodos = useMemo(() => todos.filter(todo => todo.completed && !todo.deletedAt).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [todos]);
  const trashedTodos = useMemo(() => todos.filter(todo => todo.deletedAt).sort((a,b) => new Date(b.deletedAt!).getTime() - new Date(a.deletedAt!).getTime()), [todos]);
  
  return (
      <div className="min-h-screen w-full text-gray-800">
        <div className="natural-background fixed inset-0 -z-10" />
        <div className="w-full max-w-5xl mx-auto p-4 sm:p-8">
            <header className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mb-10 gap-4">
                <h1 className="text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 drop-shadow-lg text-center">
                    My Awesome Life
                </h1>
                <div className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="icon" onClick={shuffleColors} className="h-12 w-12 rounded-full bg-white/80 shadow-md backdrop-blur-sm text-primary hover:bg-accent/20 hover:text-accent">
                            <Shuffle className="h-6 w-6" />
                        </Button>
                    </motion.div>
                    <Sheet>
                        <SheetTrigger asChild>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-white/80 shadow-md backdrop-blur-sm">
                                    <Trash2 className="h-6 w-6 text-red-500" />
                                </Button>
                            </motion.div>
                        </SheetTrigger>
                        <SheetContent className="bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 dark:from-red-900/70 dark:via-orange-900/70 dark:to-yellow-900/70 border-border shadow-2xl flex flex-col">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-3 text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
                                    <Trash2 className="h-7 w-7 text-red-500" />
                                    Trashed Tasks
                                </SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="flex-grow mt-4 pr-4 -mr-4">
                                <TrashedTaskList
                                    todos={trashedTodos}
                                    onRestoreTodo={restoreTodo}
                                    onPermanentDelete={permanentDeleteTodo}
                                    emptyMessage="Trash is empty. Good job!"
                                />
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <main className="w-full">
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-transparent p-1 rounded-lg mb-6 gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} className="w-full h-full">
                    <TabsTrigger value="pending" className="w-full data-[state=active]:bg-green-500/80 data-[state=active]:text-white rounded-full text-gray-600 bg-white/80 shadow-md data-[state=active]:shadow-xl backdrop-blur-sm">To Do</TabsTrigger>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="w-full h-full">
                    <TabsTrigger value="completed" className="w-full data-[state=active]:bg-blue-500/80 data-[state=active]:text-white rounded-full text-gray-600 bg-white/80 shadow-md data-[state=active]:shadow-xl backdrop-blur-sm">Done!</TabsTrigger>
                  </motion.div>
                </TabsList>
                <AddTaskForm onAddTask={addTodo} />
                <TabsContent value="pending" className="mt-6">
                   <TaskList
                      todos={pendingTodos}
                      onToggleTodo={toggleTodo}
                      onDeleteTodo={deleteTodo}
                      onEditTodo={editTodo}
                      emptyMessage="You're all caught up! Time to dream up new adventures."
                    />
                </TabsContent>
                <TabsContent value="completed" className="mt-6">
                    <TaskList
                        todos={completedTodos}
                        onToggleTodo={toggleTodo}
                        onDeleteTodo={deleteTodo}
                        onEditTodo={editTodo}
                        emptyMessage="No quests completed yet. Go make something happen!"
                    />
                </TabsContent>
              </Tabs>
            </main>
        </div>
      </div>
  );
}
