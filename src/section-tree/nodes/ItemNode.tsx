import { NodeApi, NodeRendererProps } from "react-arborist";
import { TreeItem } from "../treeTypes";
import treeStyles from "../SectionTree.module.css";
import styles from "./ItemNode.module.css";
import { findSection } from "../treeUtils";

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
    visibilityEditing: string | null;
  }
) {
  const { node, style, dragHandle } = props;

  let showCheckbox = false;
  if (node.parent?.level == -1) {
    const sectionHeaderIndices = node.tree.props.data
      ?.map((node, i) => (node.type === "header" ? i : -1))
      .filter((index) => index !== -1);
    const sectionIndex =
      findSection(sectionHeaderIndices!, node.childIndex) - 1;
    const sectionId =
      node.tree.props.data?.[sectionHeaderIndices![sectionIndex]]?.id.split(
        "header-"
      )[1];
    if (!sectionId) {
      return;
    }
    showCheckbox = props.visibilityEditing == sectionId;
  }

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
