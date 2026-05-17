import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-[18px] border border-hairline bg-canvas p-6 flex flex-col ${className}`}
    >
      {children}
    </div>
  );
}
