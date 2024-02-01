import { NodeRendererProps } from "react-arborist";
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
    visibilityEditing: boolean;
  }
) {
  const { node, style, dragHandle } = props;
  const showCheckbox =
    node.data.hidden != undefined &&
    node.parent?.level == -1 &&
    props.visibilityEditing;

  return (
    <div style={style} ref={dragHandle}>
      <div
        className={`${treeStyles.node} ${styles.item}`}
        onClick={() => {
          if (showCheckbox) {
            const sectionHeaderIndices = node.tree.props.data
              ?.map((node, i) => (node.type === "header" ? i : -1))
              .filter((index) => index !== -1);
            const sectionIndex =
              findSection(sectionHeaderIndices!, node.childIndex) - 1;
            const sectionId =
              node.tree.props.data?.[sectionIndex].id.split("header-")[1];
            if (!sectionId) {
              return;
            }

            props.onItemVisibilityChange(sectionId, node.id, !node.data.hidden);
          } else if (!node.isLeaf) {
            node.toggle();
          }
        }}
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
