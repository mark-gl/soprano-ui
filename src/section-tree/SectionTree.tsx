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
      ...section.children,
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
          if (props.node.data.type === "header")
            return <HeaderNode {...props} />;
          if (props.node.data.type === "separator")
            return <div style={props.style} />;
          return <ItemNode {...props} />;
        }}
      </Tree>
    </div>
  );
}
