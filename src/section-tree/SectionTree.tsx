import { Tree } from "react-arborist";
import useResizeObserver from "use-resize-observer";
import styles from "./SectionTree.module.css";
import { Item, Section } from "./treeTypes";

export function SectionTree(props: { sections: Section[] }) {
  const { ref, height } = useResizeObserver();
  const data = props.sections.reduce<Item[]>((acc, section, index) => {
    if (index > 0) {
      acc.push({ id: "separator-" + index });
    }
    const sectionData = [
      { id: section.id, name: section.name },
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
      ></Tree>
    </div>
  );
}
