import { NodeRendererProps } from "react-arborist";
import { TreeItem } from "../treeTypes";

export function ItemNode(props: NodeRendererProps<TreeItem>) {
  const { node, style, dragHandle } = props;
  return (
    <div style={style} ref={dragHandle}>
      {node.isLeaf ? "🍁" : "🗀"}
      {node.data.name}
    </div>
  );
}
