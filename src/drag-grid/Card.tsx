import { useRef, useEffect, MouseEventHandler } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import CardContent from "./CardContent";
import styles from "./DragGrid.module.css";
import ItemTypes from "./ItemTypes";

export type CardInfo = {
  id: number;
  order: number;
  url: string;
};

export type CardProps = {
  selectedCards: CardInfo[];
  clearItemSelection: () => void;
  rearrangeCards: (dragItem: {
    cards: CardInfo[];
    cardsDragStack: CardInfo[];
    draggedCard: {
      id: number;
      order: number;
      url: string;
    };
    cardsIDs: number[];
  }) => void;
  setInsertIndex: (
    dragIndex: number,
    hoverIndex: number,
    newInsertIndex: number
  ) => void;
  onSelectionChange: (
    index: number,
    metaKey: boolean,
    shiftKey: boolean
  ) => void;
  id: number;
  order: number;
  index: number;
  url: string;
  insertLineOnLeft: boolean;
  insertLineOnRight: boolean;
  isSelected: boolean;
};

export default function Card(props: CardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      const { id, order, url } = props;
      const draggedCard = { id, order, url };
      let cards;
      if (props.selectedCards.find((card) => card.id === props.id)) {
        cards = props.selectedCards;
      } else {
        props.clearItemSelection();
        cards = [draggedCard];
      }
      const otherCards = cards.concat();
      otherCards.splice(
        cards.findIndex((c) => c.id === props.id),
        1
      );
      const cardsDragStack = [draggedCard, ...otherCards];
      const cardsIDs = cards.map((c) => c.id);
      return {
        cards,
        cardsDragStack,
        draggedCard,
        cardsIDs,
      };
    },
    isDragging: (monitor) => {
      return monitor.getItem().cardsIDs.includes(props.id);
    },
    end: (item) => {
      props.rearrangeCards(item);
      props.clearItemSelection();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ hovered }, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover: (
      item: {
        draggedCard: {
          index: number;
        };
      },
      monitor
    ) => {
      const dragIndex = item.draggedCard.index;
      const hoverIndex = props.index;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Determine mouse position
      const pointerOffset = monitor.getClientOffset();

      if (!hoverBoundingRect || !pointerOffset) {
        return;
      }
      // Get horizontal middle
      const midX =
        hoverBoundingRect.left +
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const newInsertIndex =
        pointerOffset.x < midX ? hoverIndex : hoverIndex + 1;
      props.setInsertIndex(dragIndex, hoverIndex, newInsertIndex);
    },
    collect: (monitor) => ({
      hovered: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    props.onSelectionChange(props.index, e.metaKey, e.shiftKey);
  };

  useEffect(() => {
    // This gets called after every render, by default
    // (the first one, and every one after that)

    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    preview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true,
    });
    // If you want to implement componentWillUnmount,
    // return a function from here, and React will call
    // it prior to unmounting.
    // return () => console.log('unmounting...');
  }, [preview]);

  const { url } = props;
  const opacity = isDragging ? 0.4 : 1;

  const styleClasses = [];

  // if (isDragging) {
  //   styleClasses.push(styles.cardWrapperDragging);
  // }
  if (props.isSelected) {
    styleClasses.push(styles.cardWrapperSelected);
  }

  return (
    <div key={"card-div-" + props.id} style={{ position: "relative" }}>
      {props.insertLineOnLeft && hovered && (
        <div className={styles.insertLineLeft} />
      )}
      <div className={`${styles.cardWrapper} ` + styleClasses.join(" ")}>
        <div ref={ref} className="card" onClick={onClick} style={{ opacity }}>
          <CardContent url={url} />
        </div>
      </div>
      {props.insertLineOnRight && hovered && (
        <div className={styles.insertLineRight} />
      )}
    </div>
  );
}
