import { NodeApi, NodeRendererProps } from "react-arborist";
import { TreeItem } from "../treeTypes";
import treeStyles from "../SectionTree.module.css";
import styles from "./ItemNode.module.css";
import { findSectionFromNode } from "../treeUtils";

export function ItemNode(
  props: NodeRendererProps<TreeItem> & {
    FolderOpenIcon: () => JSX.Element;
    FolderClosedIcon: () => JSX.Element;
    onItemVisibilityChange?: (
      sectionId: string,
      itemId: string,
      hidden: boolean
    ) => void;
    onItemContextMenu?: (
      sectionId: string,
      itemId: string,
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => void;
    onNodeClick: (node: NodeApi<TreeItem>) => void;
    visibilityEditing: string | null;
    selectedItem: string | null;
  }
) {
  const { node, style, dragHandle } = props;
  const showCheckbox =
    node.level == 0 && props.visibilityEditing == findSectionFromNode(node);

  return (
    <div
      style={style}
      ref={dragHandle}
      onClick={() => {
        props.onNodeClick(node);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        props.onItemContextMenu?.(findSectionFromNode(node), node.id, e);
      }}
    >
      <div
        className={`${treeStyles.node} ${styles.item} ${
          props.selectedItem == node.id ? styles.selected : ""
        }`}
      >
        {!node.isLeaf && (
          <div className={styles.folderIcon}>
            {node.isOpen ? (
              <props.FolderOpenIcon />
            ) : (
              <props.FolderClosedIcon />
            )}
          </div>
        )}
        {showCheckbox && (
          <input type="checkbox" checked={!node.data.hidden} readOnly />
        )}
        {node.data.name}
      </div>
    </div>
  );
}
