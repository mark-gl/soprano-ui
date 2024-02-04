import { NodeApi, RowRendererProps } from "react-arborist";
import { SectionTreeItem } from "./treeTypes";
import { findSectionFromNode } from "./treeUtils";

export function Row({
  node,
  attrs,
  innerRef,
  children,
  onNodeClick,
  onSectionContextMenu,
  onRowKeyDown,
}: RowRendererProps<SectionTreeItem> & {
  onNodeClick: (
    node: NodeApi<SectionTreeItem>,
    event: React.MouseEvent
  ) => void;
  onSectionContextMenu?: (section: string, e: React.MouseEvent) => void;
  onRowKeyDown?: (e: React.KeyboardEvent) => void;
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
            node.tree.focusedNode?.prev?.data.type &&
            node.tree.focusedNode?.prev?.data.type in ["separator", "empty"]
          ) {
            node.tree.focus(node.prev);
          } else if (
            e.key === "ArrowDown" &&
            node.tree.focusedNode?.prev?.data.type &&
            node.tree.focusedNode?.prev?.data.type in ["separator", "empty"]
          ) {
            node.tree.focus(node.next);
          } else if (e.key === "Enter") {
            onNodeClick(node, e as unknown as React.MouseEvent);
          }
          onRowKeyDown?.(e);
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
