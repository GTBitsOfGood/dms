import React, { useEffect, useState, useRef, useCallback } from "react";

import { IconButton } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import { ChevronRightIcon, ChevronLeftIcon } from "@core/icons";
import { PaginatedCards } from "utils/types";

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    button: {
      backgroundColor: palette.background.paper,
      boxShadow: `inset 0 0 0 1px ${palette.object.lightOutline}`,
      "&:hover": {
        backgroundColor: palette.object.darkOutline
      }
    },
    nextButtonContainer: {
      marginLeft: -56,
      borderRadius: "50%"
    },
    prevButtonContainer: {
      marginLeft: -24,
      marginRight: -24,
      borderRadius: "50%",
      position: "relative",
      zIndex: 1
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      overflowX: "visible",
      overflowY: "hidden",
      marginLeft: -24,
      paddingLeft: 24
    },
    item: {
      marginRight: 32
    }
  })
);

interface Props<CardData> {
  paginatedCardsData: PaginatedCards<CardData>;
  fetchCards: (newPage: number) => Promise<PaginatedCards<CardData>>;
  renderCard: (c: CardData) => JSX.Element;
  cardGlimmer: JSX.Element;
  cardWidth?: number;
}

const DEFAULT_ROW_SIZE = 4;
const MARGIN_ADJUSTMENT = 24;

const EventsPageCardList = <CardData,>({
  paginatedCardsData,
  fetchCards,
  renderCard,
  cardGlimmer,
  cardWidth = 283
}: Props<CardData>) => {
  const classes = useStyles();

  const [cards, setCards] = useState(paginatedCardsData.cards);

  // Index of the first element displayed in the list
  const [first, setFirst] = useState(0);

  // Number of elements displayed
  const [rowSize, setRowSize] = useState(DEFAULT_ROW_SIZE);
  const [maxElem, setMaxElem] = useState(-1);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(paginatedCardsData.page);

  // Lock calls to fetchCards if one is currently in progress
  const fetchingRef = useRef(false);

  const resizeTimeoutRef = useRef<number>();

  useEffect(() => {
    if (first + rowSize > cards.length && !fetchingRef.current) {
      void (async () => {
        fetchingRef.current = true;
        setLoading(true);

        const { cards: newCards, page: newPage, isLastPage } = await fetchCards(
          pageRef.current + 1
        );

        pageRef.current = newPage;

        if (isLastPage) {
          setMaxElem(cards.length + newCards.length);
        }

        setCards(prevCards => [...prevCards, ...newCards]);
        setLoading(false);
        fetchingRef.current = false;
      })();
    }
  }, [cards.length, first, rowSize, fetchCards]);

  const handleResize = useCallback(() => {
    // wrap the resize in a 100ms debounce to prevent excess polling
    clearTimeout(resizeTimeoutRef.current);
    const w = containerRef.current?.offsetWidth;
    resizeTimeoutRef.current = window.setTimeout(() => {
      if (w != null) {
        setRowSize(
          Math.max(1, Math.floor((w - MARGIN_ADJUSTMENT) / cardWidth))
        );
      }
    }, 100);
  }, [cardWidth]);

  // add an event listener and call the initial row size update
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // click handlers for buttons
  const nextPage = () => {
    setFirst(first + rowSize);
  };

  const prevPage = () => {
    setFirst(Math.max(first - rowSize, 0));
  };

  // holds all the elements currently displayed
  const display: (CardData | null)[] = cards.slice(first, first + rowSize);
  const hasNext = maxElem == -1 || first + rowSize < maxElem;
  if (hasNext) {
    // pad the display items with null if necessary
    while (display.length < rowSize) {
      display.push(null);
    }
  }

  return (
    <div className={classes.container} ref={containerRef}>
      {first > 0 && (
        <div className={classes.prevButtonContainer}>
          <IconButton
            aria-label="previous cards"
            className={classes.button}
            onClick={prevPage}
          >
            <ChevronLeftIcon />
          </IconButton>
        </div>
      )}
      {display.map((card, i) => (
        <div className={classes.item} key={i}>
          {card == null ? cardGlimmer : renderCard(card)}
        </div>
      ))}
      {hasNext && !loading && (
        <div className={classes.nextButtonContainer}>
          <IconButton
            aria-label="next cards"
            className={classes.button}
            onClick={nextPage}
          >
            <ChevronRightIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default EventsPageCardList;
