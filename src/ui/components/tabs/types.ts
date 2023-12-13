export interface Tab {
  label: string;
  content: React.ReactNode;
};

export interface TabsProps {
  tabs: Tab[];
};
