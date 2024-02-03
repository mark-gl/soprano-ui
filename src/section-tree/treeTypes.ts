import { TreeApi } from "react-arborist";
import { TreeProps } from "react-arborist/dist/module/types/tree-props";

export type SectionTreeProps = TreeProps<TreeItem> & {
  sections?: Section[];
  FolderOpenIcon: () => JSX.Element;
  FolderClosedIcon: () => JSX.Element;
  OptionsButtonIcon: () => JSX.Element;
  DoneButtonIcon: () => JSX.Element;
  onMoveWithinSection?: (args: {
    sectionId: string;
    movedItemId: string;
    newParentId: string | null;
    newIndex: number;
  }) => void;
  onItemVisibilityChange?: (
    sectionId: string,
    itemId: string,
    hidden: boolean
  ) => void;
  onVisibilityEditingChange?: (sectionId: string | null) => void;
  onOptionsMenuActiveChange?: (
    sectionId: string | null,
    buttonRef?: React.RefObject<HTMLDivElement>
  ) => void;
  onSelectedItemChange?: (
    sectionId: string | null,
    itemId: string | null
  ) => void;
};

export interface SectionTreeApi<T> extends TreeApi<T> {
  visibilityEditing: string | null;
  setVisibilityEditing: (section: string | null) => void;
  optionsMenuActive: string | null;
  setOptionsMenuActive: (section: string | null) => void;
  selectedItem: string | null;
  setSelectedItem: (itemId: string | null) => void;
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
  sectionId?: string;
};
