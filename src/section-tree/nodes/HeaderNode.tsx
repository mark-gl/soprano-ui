import { NodeRendererProps } from "react-arborist";
import { TreeItem } from "../treeTypes";
import treeStyles from "../SectionTree.module.css";
import styles from "./HeaderNode.module.css";

export function HeaderNode(
  props: NodeRendererProps<TreeItem> & {
    OptionsButtonIcon: () => JSX.Element;
    DoneButtonIcon: () => JSX.Element;
    optionsMenuActive: string | null;
    setOptionsMenuActive: (section: string | null) => void;
    visibilityEditing: string | null;
    setVisibilityEditing: (section: string | null) => void;
  }
) {
  const { node, style, dragHandle } = props;
  const sectionEditing = node.data.sectionId == props.visibilityEditing;
  return (
    <div style={style} ref={dragHandle}>
      <div className={`${treeStyles.node} ${styles.header}`}>
        <div className={styles.headerText}>{node.data.name}</div>
        <div
          className={`${styles.optionsButton} ${
            props.optionsMenuActive == node.data.sectionId
              ? styles.optionsButtonActive
              : ""
          }`}
          onClick={() => {
            if (sectionEditing) {
              props.setVisibilityEditing(null);
              return;
            }
            props.setOptionsMenuActive(
              props.optionsMenuActive == node.data.sectionId!
                ? null
                : node.data.sectionId!
            );
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
