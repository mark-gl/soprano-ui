import { NodeApi, RowRendererProps } from "react-arborist";
import { TreeItem } from "./treeTypes";

export function Row({
  node,
  attrs,
  innerRef,
  children,
  onNodeClick,
}: RowRendererProps<TreeItem> & {
  onNodeClick: (node: NodeApi<TreeItem>) => void;
}) {
  const adjustedAttrs = { ...attrs };
  if (node.data.type === "separator") {
    adjustedAttrs.role = "separator";
    delete adjustedAttrs.tabIndex;
    delete adjustedAttrs["aria-selected"];
  }

  return (
    <>
      <div
        {...adjustedAttrs}
        ref={innerRef}
        onFocus={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (
            e.key === "ArrowUp" &&
            node.tree.focusedNode?.prev?.data.type === "separator"
          ) {
            node.tree.focus(node.prev);
          } else if (
            e.key === "ArrowDown" &&
            node.tree.focusedNode?.next?.data.type === "separator"
          ) {
            node.tree.focus(node.next);
          } else if (e.key === "Enter") {
            onNodeClick(node);
          }
        }}
      >
        {children}
      </div>
    </>
  );
}