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

  return createTreeNode(deleteTreeNode(data, { id: args.id }).result, {
    parentId: args.parentId ?? undefined,
    index: args.index + offset,
    newData: nodeToRemove,
  });
}

export function deleteTreeNode(
  data: TreeItem[],
  args: { id: string }
): { result: TreeItem[]; deletedIds: string[] } {
  let deletedIds: string[] = [];

  const result = data.reduce<TreeItem[]>((acc, item) => {
    if (item.id === args.id) {
      deletedIds.push(item.id);
      const addChildIdsToDeleted = (item: TreeItem) => {
        if (item.children) {
          item.children.forEach((child) => {
            deletedIds.push(child.id);
            addChildIdsToDeleted(child);
          });
        }
      };
      addChildIdsToDeleted(item);
      return acc;
    }

    if (item.children) {
      const innerDelete = deleteTreeNode(item.children, args);
      item.children = innerDelete.result;
      deletedIds = deletedIds.concat(innerDelete.deletedIds);
    }

    acc.push(item);
    return acc;
  }, []);

  return { result, deletedIds };
}

export function updateTreeNode(
  data: TreeItem[],
  args: { id: string; changes: Partial<TreeItem> }
): TreeItem[] {
  return data.map((item) => {
    if (item.id === args.id) {
      return { ...item, ...args.changes };
    }
    if (item.children) {
      item.children = updateTreeNode(item.children, args);
    }
    return item;
  });
}
