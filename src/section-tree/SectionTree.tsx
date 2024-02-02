import React, {
  ForwardedRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { NodeApi, NodeRendererProps, Tree, TreeApi } from "react-arborist";
import { TreeProps } from "react-arborist/dist/module/types/tree-props";
import useResizeObserver from "use-resize-observer";
import { TreeItem, Section, SectionTreeApi } from "./treeTypes";
import { HeaderNode } from "./nodes/HeaderNode";
import { ItemNode } from "./nodes/ItemNode";
import { findSection, findTopLevelIndex, shouldDisableDrop } from "./treeUtils";
import { DropCursor } from "./DropCursor";
import { Row } from "./Row";

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
      onItemVisibilityChange: (
        sectionId: string,
        itemId: string,
        hidden: boolean
      ) => void;
    },
    forwardRef: ForwardedRef<SectionTreeApi<TreeItem> | undefined>
  ) => {
    const internalTreeRef = useRef<TreeApi<TreeItem>>(null);
    const { ref, height } = useResizeObserver();
    const [visibilityEditing, setVisibilityEditing] = useState<boolean>(false);

    const data = props.sections?.reduce<TreeItem[]>((acc, section, index) => {
      if (index > 0) {
        acc.push({ id: "separator-" + index, name: "", type: "separator" });
      }
      const sectionAllHidden =
        section.children.filter((node) => node.hidden).length ==
          section.children.length && !visibilityEditing;
      const sectionData: TreeItem[] = [
        { id: "header-" + section.id, name: section.name, type: "header" },
        ...(section.children?.length > 0 && !sectionAllHidden
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
    const filteredData = visibilityEditing
      ? data
      : data?.filter((node) => !node.hidden);

    useImperativeHandle(
      forwardRef,
      () => {
        const treeApi = internalTreeRef.current;
        const sectionApi = {
          setVisibilityEditing: (enabled: boolean) => {
            setVisibilityEditing(enabled);
          },
          visibilityEditing,
        };
        return (
          treeApi ? { ...treeApi, ...sectionApi } : sectionApi
        ) as SectionTreeApi<TreeItem>;
      },
      [internalTreeRef, visibilityEditing]
    );

    const handleNodeClick = (node: NodeApi<TreeItem>) => {
      const showCheckbox =
        node.data.hidden != undefined &&
        node.parent?.level == -1 &&
        visibilityEditing;

      if (showCheckbox) {
        const sectionHeaderIndices = node.tree.props.data
          ?.map((node, i) => (node.type === "header" ? i : -1))
          .filter((index) => index !== -1);
        const sectionIndex =
          findSection(sectionHeaderIndices!, node.childIndex) - 1;
        const sectionId =
          node.tree.props.data?.[sectionIndex].id.split("header-")[1];
        if (!sectionId) {
          return;
        }
        props.onItemVisibilityChange(sectionId, node.id, !node.data.hidden);
      } else if (!node.isLeaf) {
        node.toggle();
      }
    };

    return (
      <div className={styles.treeContainer} ref={ref}>
        <Tree
          {...props}
          ref={internalTreeRef}
          data={filteredData}
          width={"100%"}
          height={height}
          rowHeight={36}
          className={styles.tree}
          renderCursor={DropCursor}
          renderRow={(rowProps) => (
            <Row {...rowProps} onNodeClick={handleNodeClick} />
          )}
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
            if (!parentNode && data) {
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
                    visibilityEditing={visibilityEditing}
                    onItemVisibilityChange={props.onItemVisibilityChange}
                    onNodeClick={handleNodeClick}
                  />
                );
            }
          }}
        </Tree>
      </div>
    );
  }
);
