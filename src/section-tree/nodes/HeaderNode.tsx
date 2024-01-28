import { NodeRendererProps } from "react-arborist";
import { TreeItem } from "../treeTypes";
import treeStyles from "../SectionTree.module.css";
import styles from "./HeaderNode.module.css";

export function HeaderNode(props: NodeRendererProps<TreeItem>) {
  const { node, style, dragHandle } = props;
  return (
    <div style={style} ref={dragHandle}>
      <div className={`${treeStyles.node} ${styles.header}`}>
        {node.data.name}
      </div>
    </div>
  );
}
