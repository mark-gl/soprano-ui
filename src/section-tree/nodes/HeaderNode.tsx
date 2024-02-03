import { NodeApi, NodeRendererProps } from "react-arborist";
import { SectionTreeItem } from "../treeTypes";
import treeStyles from "../SectionTree.module.css";
import styles from "./HeaderNode.module.css";
import { useRef } from "react";

export function HeaderNode(
  props: NodeRendererProps<SectionTreeItem> & {
    OptionsButtonIcon: () => JSX.Element;
    DoneButtonIcon: () => JSX.Element;
    optionsMenuActive: string | null;
    visibilityEditing: string | null;
    onNodeClick: (node: NodeApi<SectionTreeItem>) => void;
  }
) {
  const optionsButtonRef = useRef<HTMLDivElement>(null);
  const { node, style, dragHandle } = props;
  const sectionEditing = node.data.sectionId == props.visibilityEditing;
  return (
    <div style={style} ref={dragHandle}>
      <div className={`${treeStyles.node} ${styles.header}`}>
        <div className={styles.headerText}>{node.data.name}</div>
        <div
          ref={optionsButtonRef}
          className={`${styles.optionsButton} ${
            props.optionsMenuActive == node.data.sectionId
              ? styles.optionsButtonActive
              : ""
          }`}
          onClick={() => {
            props.onNodeClick(node);
          }}
        >
          {sectionEditing ? (
            <props.DoneButtonIcon />
          ) : (
            <props.OptionsButtonIcon />
          )}
        </div>
      </div>
    </div>
  );
}
