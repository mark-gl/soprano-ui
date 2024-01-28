import { NodeRendererProps } from "react-arborist";
import { TreeItem } from "../treeTypes";
import treeStyles from "../SectionTree.module.css";
import styles from "./ItemNode.module.css";

export function ItemNode(props: NodeRendererProps<TreeItem>) {
  const { node, style, dragHandle } = props;
  return (
    <div style={style} ref={dragHandle}>
      <div className={`${treeStyles.node} ${styles.item}`}>
        {!node.isLeaf && <div className={styles.folderIcon}>{"🗀"}</div>}
        {node.data.name}
      </div>
    </div>
  );
}
