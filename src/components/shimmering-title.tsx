import { cn } from "@/lib/utils";

export default function ShimmeringTitle() {
  return (
    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        <span
            className={cn(
            "relative inline-block",
            "before:absolute before:inset-0 before:bg-[linear-gradient(90deg,transparent_20%,hsl(var(--primary))_50%,transparent_80%)] before:bg-[length:200%_100%]",
            "before:animate-[shimmer_5s_ease-in-out_infinite]",
            "dark:before:bg-[linear-gradient(90deg,transparent_20%,hsl(var(--primary))_50%,transparent_80%)]"
            )}
        >
            <span
            className={cn(
                "relative bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent",
                "dark:from-primary dark:via-primary dark:to-primary"
            )}
            >
            Task Canvas
            </span>
        </span>
    </h1>
  );
}
