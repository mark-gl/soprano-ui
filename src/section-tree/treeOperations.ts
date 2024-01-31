import { TreeItem } from "./treeTypes";
import { findNode, findParentNode } from "./treeUtils";

export function createTreeNode(
  data: TreeItem[],
  args: { newData: TreeItem; parentId?: string; index?: number }
): TreeItem[] {
  if (!args.parentId) {
    data.splice(args.index ?? data.length, 0, args.newData);
    return data;
  }

  const parent = findNode(data, args.parentId);
  if (parent) {
    parent.children = parent.children || [];
    parent.children.splice(
      args.index ?? parent.children.length,
      0,
      args.newData
    );
  }

  return data;
}

export function moveTreeNode(
  data: TreeItem[],
  args: { id: string; parentId: string | null; index: number }
): TreeItem[] {
  const nodeToRemove = findNode(data, args.id);
  if (!nodeToRemove) return data;

  let offset = 0;
  const originalParent = findParentNode(data, args.id);
  if (originalParent == null || originalParent.id === args.parentId) {
    let originalIndex = 0;
    if (originalParent) {
      originalIndex =
        originalParent.children?.findIndex((item) => item.id === args.id) ?? 0;
    } else {
      originalIndex = data?.findIndex((item) => item.id === args.id);
    }

    // If this node was originally behind its new index, offset the index by 1
    const originalParentId = originalParent?.id ?? null;
    if (originalIndex < args.index && originalParentId === args.parentId) {
      offset = -1;
    }
  }

  return createTreeNode(deleteTreeNode(data, { id: args.id }), {
    parentId: args.parentId ?? undefined,
    index: args.index + offset,
    newData: nodeToRemove,
  });
}

export function deleteTreeNode(
  data: TreeItem[],
  args: { id: string }
): TreeItem[] {
  return data.reduce<TreeItem[]>((acc, item) => {
    if (item.id === args.id) return acc;
    if (item.children) {
      item.children = deleteTreeNode(item.children, args);
    }
    acc.push(item);
    return acc;
  }, []);
}
