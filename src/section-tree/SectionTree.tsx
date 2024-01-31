import React, { ForwardedRef } from "react";
import { NodeRendererProps, Tree, TreeApi } from "react-arborist";
import { TreeProps } from "react-arborist/dist/module/types/tree-props";
import useResizeObserver from "use-resize-observer";
import { TreeItem, Section } from "./treeTypes";
import { HeaderNode } from "./nodes/HeaderNode";
import { ItemNode } from "./nodes/ItemNode";
import { findSection, findTopLevelIndex, shouldDisableDrop } from "./treeUtils";
import { DropCursor } from "./DropCursor";

import styles from "./SectionTree.module.css";

export const SectionTree = React.forwardRef(
  (
    props: TreeProps<TreeItem> & {
      sections?: Section[];
      FolderOpenIcon: () => JSX.Element;
      FolderClosedIcon: () => JSX.Element;
      onMoveWithinSection: (args: {
        sectionId: string;
        movedItemId: string;
        newParentId: string | null;
        newIndex: number;
      }) => void;
    },
    forwardRef: ForwardedRef<TreeApi<TreeItem> | undefined>
  ) => {
    const { ref, height } = useResizeObserver();
    const data = props.sections?.reduce<TreeItem[]>((acc, section, index) => {
      if (index > 0) {
        acc.push({ id: "separator-" + index, name: "", type: "separator" });
      }
      const sectionData: TreeItem[] = [
        { id: "header-" + section.id, name: section.name, type: "header" },
        ...(section.children?.length > 0
          ? section.children
          : [
              {
                id: section.id + "-empty",
                name: section.emptyMessage,
                type: "empty" as const,
              },
            ]),
      ];
      return acc.concat(sectionData);
    }, []);

    return (
      <div className={styles.treeContainer} ref={ref}>
        <Tree
          {...props}
          ref={forwardRef}
          data={data}
          width={"100%"}
          height={height}
          rowHeight={36}
          className={styles.tree}
          renderCursor={DropCursor}
          disableDrag={(node) =>
            node.type === "separator" || node.type === "header"
          }
          disableDrop={(args) => {
            return shouldDisableDrop(
              args.dragNodes[0],
              args.parentNode,
              args.index
            );
          }}
          onMove={(args) => {
            if (!props.sections) return;
            const { parentId, parentNode, index } = args;
            const dragNode = args.dragNodes[0];

            const sectionHeaderIndices = dragNode.tree.props.data
              ?.map((node, i) => (node.type === "header" ? i : -1))
              .filter((index) => index !== -1);
            const topLevelIndex = findTopLevelIndex(
              dragNode.parent!,
              dragNode.childIndex
            );

            const sectionIndex =
              findSection(sectionHeaderIndices!, topLevelIndex) - 1;
            let adjustedIndex = index;
            if (!parentNode) {
              // If it's top-level, offset the index by the number of items before this section
              adjustedIndex -= sectionHeaderIndices![sectionIndex] + 1;
            }

            props.onMoveWithinSection({
              sectionId: props.sections[sectionIndex].id,
              movedItemId: dragNode.id,
              newParentId: parentId,
              newIndex: adjustedIndex,
            });
          }}
        >
          {(nodeProps: NodeRendererProps<TreeItem>) => {
            switch (nodeProps.node.data.type) {
              case "header":
                return <HeaderNode {...nodeProps} />;
              case "separator":
                return <div style={nodeProps.style} />;
              case "empty":
                return (
                  <div style={nodeProps.style}>
                    <div className={`${styles.node} ${styles.empty}`}>
                      {nodeProps.node.data.name}
                    </div>
                  </div>
                );
              default:
                return (
                  <ItemNode
                    {...nodeProps}
                    FolderOpenIcon={props.FolderOpenIcon}
                    FolderClosedIcon={props.FolderClosedIcon}
                  />
                );
            }
          }}
        </Tree>
      </div>
    );
  }
);
