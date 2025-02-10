import * as React from "react";
import { cn } from "../../lib/utils";

interface DropdownMenuProps {
  readonly children: React.ReactNode;
  readonly trigger: React.ReactNode;
}

export function DropdownMenu({ children, trigger }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      setOpen(!open);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex w-full"
      >
        {trigger}
      </button>
      {open && (
        <div
          className="absolute right-0 z-50 mt-2 min-w-[8rem] rounded-md border bg-popover p-1 shadow-md"
          role="menu"
          aria-orientation="vertical"
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly className?: string;
  readonly children: React.ReactNode;
}

export function DropdownMenuItem({
  className,
  children,
  ...props
}: DropdownMenuItemProps) {
  return (
    <button
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      role="menuitem"
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator() {
  return <hr className="-mx-1 my-1 h-px bg-border" />;
}

export function DropdownMenuLabel({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <div className="px-2 py-1.5 text-sm font-semibold">{children}</div>;
}

export function DropdownMenuContent({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <div className="py-1">{children}</div>;
}

export function DropdownMenuTrigger({
  children,
  asChild,
}: {
  readonly children: React.ReactNode;
  readonly asChild?: boolean;
}) {
  return asChild ? children : <button>{children}</button>;
}
