import { NodeApi } from "react-arborist";
import { TreeItem } from "./treeTypes";

export const findTopLevelIndex = (
  node: NodeApi,
  relativeIndex?: number
): number => {
  if (node.level === -1) {
    return relativeIndex ?? node.childIndex;
  }

  let currentNode = node;
  while (currentNode.parent && currentNode.level > 0) {
    currentNode = currentNode.parent;
  }

  return currentNode.childIndex;
};

export const findSection = (
  sectionHeaderIndices: number[],
  index: number
): number => {
  for (let i = 0; i < sectionHeaderIndices.length; i++) {
    if (index <= sectionHeaderIndices[i]) {
      return i;
    }
  }
  return sectionHeaderIndices.length;
};

export const shouldDisableDrop = (
  sourceNode: NodeApi<TreeItem>,
  destinationParentNode: NodeApi<TreeItem>,
  destinationRelativeIndex: number
): boolean => {
  if (!sourceNode) return true;

  const sectionHeaderIndices = sourceNode.tree.props.data
    ?.map((node, i) => (node.type === "header" ? i : -1))
    .filter((index) => index !== -1);

  const sourceTopLevelIndex = findTopLevelIndex(
    sourceNode.parent!,
    sourceNode.childIndex
  );
  const destinationTopLevelIndex = findTopLevelIndex(
    destinationParentNode,
    destinationRelativeIndex
  );

  const sourceSection = findSection(sectionHeaderIndices!, sourceTopLevelIndex);
  const destinationSection = findSection(
    sectionHeaderIndices!,
    destinationTopLevelIndex
  );

  if (
    destinationSection != sourceSection ||
    destinationTopLevelIndex == sectionHeaderIndices![destinationSection] ||
    destinationTopLevelIndex == sectionHeaderIndices![destinationSection]
  ) {
    return true;
  }

  return false;
};
