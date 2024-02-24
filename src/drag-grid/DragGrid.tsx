import { useReducer } from "react";
import CardDragLayer from "./CardDragLayer";
import Card, { CardInfo } from "./Card";
import styles from "./DragGrid.module.css";

const TOTAL_ITEMS = 50;

type DragGridState = {
  cards: CardInfo[];
  selectedCards: CardInfo[];
  lastSelectedIndex: number;
  dragIndex: number;
  hoverIndex: number;
  insertIndex: number;
  isDragging: boolean;
};

const init_cards = [...Array(TOTAL_ITEMS).keys()].map((i) => ({
  id: i + 1,
  order: i,
  url: "https://picsum.photos/400/400?random&" + i,
}));

const init_state: DragGridState = {
  cards: init_cards,
  selectedCards: [],
  lastSelectedIndex: -1,
  dragIndex: -1,
  hoverIndex: -1,
  insertIndex: -1,
  isDragging: false,
};

type ClearSelectionAction = {
  type: "CLEAR_SELECTION";
};

type UpdateSelectionAction = {
  type: "UPDATE_SELECTION";
  newSelectedCards: CardInfo[];
  newLastSelectedIndex: number;
};

type RearrangeCardsAction = {
  type: "REARRANGE_CARDS";
  newCards: CardInfo[];
};

type SetInsertIndexAction = {
  type: "SET_INSERTINDEX";
  dragIndex: number;
  hoverIndex: number;
  insertIndex: number;
};

type AnyDragGridAction =
  | ClearSelectionAction
  | UpdateSelectionAction
  | RearrangeCardsAction
  | SetInsertIndexAction;

const cardReducer = (state: DragGridState, action: AnyDragGridAction) => {
  switch (action.type) {
    case "CLEAR_SELECTION":
      return {
        ...state,
        selectedCards: init_state.selectedCards,
        lastSelectedIndex: init_state.lastSelectedIndex,
      };
    case "UPDATE_SELECTION":
      return {
        ...state,
        selectedCards: action.newSelectedCards,
        lastSelectedIndex: action.newLastSelectedIndex,
      };
    case "REARRANGE_CARDS":
      return { ...state, cards: action.newCards };
    case "SET_INSERTINDEX":
      return {
        ...state,
        dragIndex: action.dragIndex,
        hoverIndex: action.hoverIndex,
        insertIndex: action.insertIndex,
      };
    default:
      throw new Error();
  }
};

export default function DragGrid() {
  const [state, dispatch] = useReducer(cardReducer, init_state);

  const clearItemSelection = () => {
    dispatch({ type: "CLEAR_SELECTION" });
  };

  const handleItemSelection = (
    index: number,
    cmdKey: boolean,
    shiftKey: boolean
  ) => {
    let newSelectedCards: CardInfo[];
    const cards = state.cards;
    const card = index < 0 ? undefined : cards[index];
    const newLastSelectedIndex = index;

    if (!card) {
      return;
    }
    if (!cmdKey && !shiftKey) {
      newSelectedCards = [card];
    } else if (shiftKey) {
      if (state.lastSelectedIndex >= index) {
        newSelectedCards = [
          ...state.selectedCards,
          ...cards.slice(index, state.lastSelectedIndex + 1),
        ];
      } else {
        newSelectedCards = [
          ...state.selectedCards,
          ...cards.slice(state.lastSelectedIndex + 1, index + 1),
        ];
      }
    } else if (cmdKey) {
      const foundIndex = state.selectedCards.findIndex(
        (f: CardInfo) => f === card
      );
      // If found remove it to unselect it.
      if (foundIndex >= 0) {
        newSelectedCards = [
          ...state.selectedCards.slice(0, foundIndex),
          ...state.selectedCards.slice(foundIndex + 1),
        ];
      } else {
        newSelectedCards = [...state.selectedCards, card];
      }
    }
    const finalList = cards
      ? cards.filter((f: CardInfo) => newSelectedCards.find((a) => a === f))
      : [];
    dispatch({
      type: "UPDATE_SELECTION",
      newSelectedCards: finalList,
      newLastSelectedIndex: newLastSelectedIndex,
    });
  };

  const rearrangeCards = (card: {
    cards: CardInfo[];
    cardsDragStack: CardInfo[];
    draggedCard: {
      id: number;
      order: number;
      url: string;
    };
    cardsIDs: number[];
  }) => {
    const cards = state.cards.slice();
    const draggedCards = card.cards;

    let dividerIndex;
    if (state.insertIndex >= 0 && state.insertIndex < cards.length) {
      dividerIndex = state.insertIndex;
    } else {
      // If missing insert index, put the dragged cards to the end of the queue
      dividerIndex = cards.length;
    }
    const upperHalfRemainingCards = cards
      .slice(0, dividerIndex)
      .filter((c: CardInfo) => !draggedCards.find((dc) => dc.id === c.id));
    const lowerHalfRemainingCards = cards
      .slice(dividerIndex)
      .filter((c: CardInfo) => !draggedCards.find((dc) => dc.id === c.id));
    const newCards = [
      ...upperHalfRemainingCards,
      ...draggedCards,
      ...lowerHalfRemainingCards,
    ];
    dispatch({ type: "REARRANGE_CARDS", newCards: newCards });
  };

  const setInsertIndex = (
    dragIndex: number,
    hoverIndex: number,
    newInsertIndex: number
  ) => {
    if (
      state.dragIndex === dragIndex &&
      state.hoverIndex === hoverIndex &&
      state.insertIndex === newInsertIndex
    ) {
      return;
    }
    dispatch({
      type: "SET_INSERTINDEX",
      dragIndex: dragIndex,
      hoverIndex: hoverIndex,
      insertIndex: newInsertIndex,
    });
  };

  return (
    <main>
      <CardDragLayer />
      <div className={styles.container}>
        {state.cards.map((card: CardInfo, i: number) => {
          const insertLineOnLeft =
            state.hoverIndex === i && state.insertIndex === i;
          const insertLineOnRight =
            state.hoverIndex === i && state.insertIndex === i + 1;
          return (
            <Card
              key={"card-" + card.id}
              id={card.id}
              index={i}
              order={card.order}
              url={card.url}
              selectedCards={state.selectedCards}
              rearrangeCards={rearrangeCards}
              setInsertIndex={setInsertIndex}
              onSelectionChange={handleItemSelection}
              clearItemSelection={clearItemSelection}
              isSelected={state.selectedCards.includes(card)}
              insertLineOnLeft={insertLineOnLeft}
              insertLineOnRight={insertLineOnRight}
            />
          );
        })}
      </div>
    </main>
  );
}
