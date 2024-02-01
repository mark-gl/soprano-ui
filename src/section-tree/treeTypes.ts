export type Item = {
  id: string;
  name: string;
  children?: Item[];
  hidden?: boolean;
};

export type Section = {
  id: string;
  name: string;
  emptyMessage: string;
  children: Item[];
};

export type TreeItem = Item & {
  type?: "separator" | "header" | "empty";
};
