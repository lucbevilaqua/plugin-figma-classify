import { ReactNode } from "react";

export interface PopoverProps {
  children: ReactNode
  content: ReactNode
  direction?: "top" | "bottom"
}
