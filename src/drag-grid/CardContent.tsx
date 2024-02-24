import styles from "./DragGrid.module.css";

const CardContent = (props: { url: string }) => (
  <div className={styles.cardOuter}>
    <div className={styles.cardInner}>
      <img src={props.url} width="80" height="45" draggable="false" />
    </div>
  </div>
);

export default CardContent;
