import styles from "./DragGrid.module.css";

const CardContent = (props: { url: string }) => (
  <div className={styles.cardOuter}>
    <div className={styles.cardInner}>
      <img
        src={props.url}
        style={{ width: "100%", height: "100%" }}
        draggable="false"
      />
    </div>
  </div>
);

export default CardContent;
