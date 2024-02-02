import { TreeApi } from "react-arborist";

export interface SectionTreeApi<T> extends TreeApi<T> {
  visibilityEditing: string | null;
  setVisibilityEditing: (section: string | null) => void;
  optionsMenuActive: string | null;
  setOptionsMenuActive: (section: string | null) => void;
}

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
