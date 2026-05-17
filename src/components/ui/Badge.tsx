import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export default function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center px-4 py-1 rounded-full text-[14px] font-normal leading-[1.43] tracking-[-0.224px] border border-hairline bg-canvas text-ink ${className}`}
    >
      {children}
    </span>
  );
}
