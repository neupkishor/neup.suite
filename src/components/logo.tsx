import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 0.5C6.54518 0.5 0.5 6.54518 0.5 14C0.5 21.4548 6.54518 27.5 14 27.5C21.4548 27.5 27.5 21.4548 27.5 14C27.5 6.54518 21.4548 0.5 14 0.5Z"
          fill="hsl(var(--primary))"
        />
        <path
          d="M9.89739 18.1026V9.89739H12.336L14.9482 14.5323L17.5619 9.89739H20.002V18.1026H18.0694V12.1818L15.6521 16.7118H14.2442L11.8269 12.1818V18.1026H9.89739Z"
          fill="hsl(var(--primary-foreground))"
        />
      </svg>
      <span className="font-headline text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
        Neup.Suite
      </span>
    </div>
  );
}
