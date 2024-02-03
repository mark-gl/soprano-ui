import React, {
  ForwardedRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { NodeApi, NodeRendererProps, Tree, TreeApi } from "react-arborist";
import useResizeObserver from "use-resize-observer";
import { TreeItem, SectionTreeApi, SectionTreeProps } from "./treeTypes";
import { HeaderNode } from "./nodes/HeaderNode";
import { ItemNode } from "./nodes/ItemNode";
import {
  findSection,
  findSectionFromNode,
  findTopLevelIndex,
  shouldDisableDrop,
} from "./treeUtils";
import { DropCursor } from "./DropCursor";
import { Row } from "./Row";

import styles from "./SectionTree.module.css";

export const SectionTree = React.forwardRef(
  (
    props: SectionTreeProps,
    forwardRef: ForwardedRef<SectionTreeApi<TreeItem> | undefined>
  ) => {
    const internalTreeRef = useRef<TreeApi<TreeItem>>(null);
    const { ref, height } = useResizeObserver();

    const [visibilityEditing, setVisibilityEditing] = useState<string | null>(
      null
    );

    const setVisibilityEditingCallback = useCallback(
      (sectionId: string | null) => {
        setVisibilityEditing(sectionId);
        props.onVisibilityEditingChange?.(sectionId);
      },
      [props]
    );

    const [optionsMenuActive, setOptionsMenuActive] = useState<string | null>(
      null
    );

    const setOptionsMenuActiveCallback = useCallback(
      (
        sectionId: string | null,
        buttonRef: React.RefObject<HTMLDivElement>
      ) => {
        setOptionsMenuActive(sectionId);
        props.onOptionsMenuActiveChange?.(sectionId, buttonRef);
      },
      [props]
    );

    const filteredData = props.sections?.reduce<TreeItem[]>(
      (acc, section, index) => {
        if (index > 0) {
          acc.push({
            id: "separator-" + index,
            name: "",
            type: "separator",
            sectionId: props.sections?.[index - 1].id,
          });
        }
        const sectionAllHidden =
          section.children.filter((node) => node.hidden).length ==
            section.children.length && visibilityEditing != section.id;
        const sectionData: TreeItem[] = [
          {
            id: "header-" + section.id,
            name: section.name,
            type: "header",
            sectionId: section.id,
          },
          ...(section.children?.length > 0 && !sectionAllHidden
            ? visibilityEditing == section.id
              ? section.children.map((item) => ({
                  ...item,
                  sectionId: section.id,
                }))
              : section.children
                  .filter((node) => !node.hidden)
                  .map((item) => ({
                    ...item,
                    sectionId: section.id,
                  }))
            : [
                {
                  id: section.id + "-empty",
                  name: section.emptyMessage,
                  type: "empty" as const,
                  sectionId: section.id,
                },
              ]),
        ];
        return acc.concat(sectionData);
      },
      []
    );

    useImperativeHandle(
      forwardRef,
      () => {
        const treeApi = internalTreeRef.current;
        const sectionApi = {
          visibilityEditing,
          setVisibilityEditing: (section: string | null) => {
            setVisibilityEditingCallback(section);
          },
          setOptionsMenuActive: (
            section: string | null,
            buttonRef: React.RefObject<HTMLDivElement>
          ) => {
            setOptionsMenuActiveCallback(section, buttonRef);
          },
          optionsMenuActive,
          setSelectedItem: (itemId: string) => {
            const node = treeApi?.root.tree.get(itemId);
            if (node) {
              node.tree.select(itemId);
            } else {
              treeApi?.root.tree.deselectAll();
            }
          },
          selectedItem: treeApi?.selectedNodes[0]?.id,
        };
        return (
          treeApi ? { ...treeApi, ...sectionApi } : sectionApi
        ) as SectionTreeApi<TreeItem>;
      },
      [
        internalTreeRef,
        visibilityEditing,
        optionsMenuActive,
        setVisibilityEditingCallback,
        setOptionsMenuActiveCallback,
      ]
    );

    useEffect(() => {
      let checkClickOutside = false;

      const handleDocumentClick = (event: MouseEvent) => {
        if (!visibilityEditing) return;
        if (!checkClickOutside) {
          checkClickOutside = true;
          return;
        }

        const target = event.target as HTMLElement;
        if (!target.closest(`[data-section="${visibilityEditing}"]`)) {
          setVisibilityEditingCallback(null);
        }

        checkClickOutside = false;
      };

      document.addEventListener("click", handleDocumentClick);
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }, [setVisibilityEditingCallback, visibilityEditing]);

    useEffect(() => {
      const treeArea = internalTreeRef.current?.listEl.current;
      const handleContextMenu = (event: MouseEvent) => {
        if (event.target === treeArea) {
          props.onEmptySpaceContextMenu?.(event);
        }
      };

      treeArea?.addEventListener("contextmenu", handleContextMenu);

      return () => {
        treeArea?.removeEventListener("contextmenu", handleContextMenu);
      };
    }, [props, ref]);

    const handleNodeClick = (node: NodeApi<TreeItem>) => {
      const sectionId = findSectionFromNode(node);
      if (node.data.type == "header") {
        if (visibilityEditing == sectionId) {
          setVisibilityEditing(null);
          return;
        }
        setOptionsMenuActive(optionsMenuActive == sectionId ? null : sectionId);
      } else if (node.parent?.level == -1 && visibilityEditing == sectionId) {
        props.onItemVisibilityChange?.(sectionId, node.id, !node.data.hidden);
      } else if (!node.isLeaf) {
        node.toggle();
        props.onFolderAction?.(sectionId, node.id, node.isOpen);
      } else {
        node.tree.select(node.id);
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
          rowHeight={props.rowHeight ?? 36}
          openByDefault={false}
          className={styles.tree}
          renderCursor={DropCursor}
          renderRow={(rowProps) => (
            <Row
              {...rowProps}
              onNodeClick={handleNodeClick}
              onSectionContextMenu={props.onSectionContextMenu}
              onRowKeyDown={props.onRowKeyDown}
            />
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
            if (!parentNode) {
              // If it's top-level, offset the index by the number of items before this section
              adjustedIndex -= sectionHeaderIndices![sectionIndex] + 1;
            }

            props.onMoveWithinSection?.({
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
                return (
                  <HeaderNode
                    {...nodeProps}
                    OptionsButtonIcon={props.OptionsButtonIcon}
                    DoneButtonIcon={props.DoneButtonIcon}
                    optionsMenuActive={optionsMenuActive}
                    visibilityEditing={visibilityEditing}
                    onNodeClick={handleNodeClick}
                  />
                );
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
                    onItemContextMenu={props.onItemContextMenu}
                    onRenameWithinSection={props.onRenameWithinSection}
                  />
                );
            }
          }}
        </Tree>
      </div>
    );
  }
);
