import React from "react";

export interface Row {
  name: string;
  code: string;
  type: string;
  values: Array<string>;
}
export interface TableProps {
  children: React.ReactNode;
}
