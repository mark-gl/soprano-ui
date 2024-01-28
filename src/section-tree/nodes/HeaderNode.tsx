import { NodeRendererProps } from "react-arborist";
import { TreeItem } from "../treeTypes";

export function HeaderNode(props: NodeRendererProps<TreeItem>) {
  const { node, style, dragHandle } = props;
  return (
    <div style={style} ref={dragHandle}>
      {node.data.name}
    </div>
  );
}
