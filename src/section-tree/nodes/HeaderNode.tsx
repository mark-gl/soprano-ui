import { NodeRendererProps } from "react-arborist";
import { TreeItem } from "../treeTypes";
import treeStyles from "../SectionTree.module.css";
import styles from "./HeaderNode.module.css";

export function HeaderNode(
  props: NodeRendererProps<TreeItem> & {
    OptionsButtonIcon: () => JSX.Element;
    optionsMenuActive: string | null;
    setOptionsMenuActive: (section: string | null) => void;
  }
) {
  const { node, style, dragHandle } = props;
  const sectionName = node.data.id.split("header-")[1];
  return (
    <div style={style} ref={dragHandle}>
      <div className={`${treeStyles.node} ${styles.header}`}>
        <div className={styles.headerText}>{node.data.name}</div>
        <div
          className={`${styles.optionsButton} ${
            props.optionsMenuActive == sectionName
              ? styles.optionsButtonActive
              : ""
          }`}
          onClick={() => {
            props.setOptionsMenuActive(
              props.optionsMenuActive == sectionName ? null : sectionName
            );
          }}
        >
          <props.OptionsButtonIcon />
        </div>
      </div>
    </div>
  );
}
