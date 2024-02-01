import { NodeApi, NodeRendererProps } from "react-arborist";
import { TreeItem } from "../treeTypes";
import treeStyles from "../SectionTree.module.css";
import styles from "./ItemNode.module.css";

export function ItemNode(
  props: NodeRendererProps<TreeItem> & {
    FolderOpenIcon: () => JSX.Element;
    FolderClosedIcon: () => JSX.Element;
    onItemVisibilityChange: (
      sectionId: string,
      itemId: string,
      hidden: boolean
    ) => void;
    onNodeClick: (node: NodeApi<TreeItem>) => void;
    visibilityEditing: boolean;
  }
) {
  const { node, style, dragHandle } = props;
  const showCheckbox =
    node.data.hidden != undefined &&
    node.parent?.level == -1 &&
    props.visibilityEditing;

  return (
    <div
      style={style}
      ref={dragHandle}
      onClick={() => {
        props.onNodeClick(node);
      }}
    >
      <div className={`${treeStyles.node} ${styles.item}`}>
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
