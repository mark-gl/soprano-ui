import { NodeApi, RowRendererProps } from "react-arborist";
import { TreeItem } from "./treeTypes";
import { findSectionFromNode } from "./treeUtils";

export function Row({
  node,
  attrs,
  innerRef,
  children,
  onNodeClick,
  onSectionContextMenu,
}: RowRendererProps<TreeItem> & {
  onNodeClick: (node: NodeApi<TreeItem>) => void;
  onSectionContextMenu?: (section: string, e: React.MouseEvent) => void;
}) {
  const section = findSectionFromNode(node);
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
        onContextMenu={(e) => {
          onSectionContextMenu?.(section, e);
        }}
        data-section={section}
      >
        {children}
      </div>
    </>
  );
}
