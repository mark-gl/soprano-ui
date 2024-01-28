import { NodeRendererProps } from "react-arborist";
import { TreeItem } from "../treeTypes";
import treeStyles from "../SectionTree.module.css";
import styles from "./ItemNode.module.css";

export function ItemNode(
  props: NodeRendererProps<TreeItem> & {
    FolderOpenIcon: () => JSX.Element;
    FolderClosedIcon: () => JSX.Element;
  }
) {
  const { node, style, dragHandle } = props;
  return (
    <div style={style} ref={dragHandle}>
      <div
        className={`${treeStyles.node} ${styles.item}`}
        onClick={() => {
          if (!node.isLeaf) {
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
        {node.data.name}
      </div>
    </div>
  );
}
