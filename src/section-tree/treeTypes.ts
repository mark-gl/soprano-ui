export type Item = {
  id: string;
  name?: string;
  children?: Item[];
};

export type Section = {
  id: string;
  name: string;
  children: Item[];
};

export type TreeItem = Item & {
  type?: "separator" | "header";
};
