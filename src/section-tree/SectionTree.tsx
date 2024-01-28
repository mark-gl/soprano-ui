import { NodeRendererProps, Tree } from "react-arborist";
import useResizeObserver from "use-resize-observer";
import { TreeItem, Section } from "./treeTypes";
import { HeaderNode } from "./nodes/HeaderNode";
import { ItemNode } from "./nodes/ItemNode";
import { shouldDisableDrop } from "./treeUtils";

import styles from "./SectionTree.module.css";

export function SectionTree(props: { sections: Section[] }) {
  const { ref, height } = useResizeObserver();
  const data = props.sections.reduce<TreeItem[]>((acc, section, index) => {
    if (index > 0) {
      acc.push({ id: "separator-" + index, type: "separator" });
    }
    const sectionData: TreeItem[] = [
      { id: "header-" + section.id, name: section.name, type: "header" },
      ...(section.children.length > 0
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
        initialData={data}
        width={"100%"}
        height={height}
        rowHeight={36}
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
      >
        {(props: NodeRendererProps<TreeItem>) => {
          switch (props.node.data.type) {
            case "header":
              return <HeaderNode {...props} />;
            case "separator":
              return <div style={props.style} />;
            case "empty":
              return <div style={props.style}>{props.node.data.name}</div>;
            default:
              return <ItemNode {...props} />;
          }
        }}
      </Tree>
    </div>
  );
}
