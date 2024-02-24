import { CardInfo } from "./Card";
import CardContent from "./CardContent";
import styles from "./DragGrid.module.css";

const CardsDragPreview = (props: { cards: CardInfo[] }) => {
  return (
    <div>
      {props.cards.slice(0, 3).map((card, i) => (
        <div
          key={card.id}
          className={`${styles.card} ${styles.cardDragged}`}
          style={{
            zIndex: props.cards.length - i,
            transform: `rotateZ(${-i * 2.5}deg)`,
          }}
        >
          <CardContent url={card.url} />
        </div>
      ))}
    </div>
  );
};

export default CardsDragPreview;
