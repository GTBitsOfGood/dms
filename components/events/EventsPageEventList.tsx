import React, { useEffect, useState, useRef, useCallback } from "react";

import { IconButton } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useRouter } from "next/router";

import { ChevronRightIcon, ChevronLeftIcon } from "@core/icons";
import config from "config";
import { PaginatedEventCards, EventCardData } from "utils/types";

import EventsPageEventCard from "./EventsPageEventCard";
import EventsPageEventCardGlimmer from "./EventsPageEventCardGlimmer";

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
      height: 270,
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

interface Props {
  paginatedEventCardsData: PaginatedEventCards;
  getMoreEvents: (newPage: number) => Promise<PaginatedEventCards>;
}

const DEFAULT_ROW_SIZE = 4;
const MARGIN_ADJUSTMENT = 24;
const CARD_WIDTH = 283;

const EventsPageEventList: React.FC<Props> = ({
  paginatedEventCardsData,
  getMoreEvents
}) => {
  const classes = useStyles();

  const [events, setEvents] = useState(paginatedEventCardsData.eventCards);

  const router = useRouter();

  // Index of the first element displayed in the list
  const [first, setFirst] = useState(0);

  // Number of elements displayed
  const [rowSize, setRowSize] = useState(DEFAULT_ROW_SIZE);
  const [maxElem, setMaxElem] = useState(-1);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(paginatedEventCardsData.page);

  // Lock calls to getEvents if one is currently in progress
  const fetchingRef = useRef(false);

  const resizeTimeoutRef = useRef<number>();

  useEffect(() => {
    if (first + rowSize > events.length && !fetchingRef.current) {
      void (async () => {
        fetchingRef.current = true;
        setLoading(true);

        const {
          eventCards: newEvents,
          page: newPage,
          isLastPage
        } = await getMoreEvents(pageRef.current + 1);

        pageRef.current = newPage;

        if (isLastPage) {
          setMaxElem(events.length + newEvents.length);
        }

        setEvents(prevEvents => [...prevEvents, ...newEvents]);
        setLoading(false);
        fetchingRef.current = false;
      })();
    }
  }, [events.length, first, rowSize, getMoreEvents]);

  const handleResize = useCallback(() => {
    // wrap the resize in a 100ms debounce to prevent excess polling
    clearTimeout(resizeTimeoutRef.current);
    const w = containerRef.current?.offsetWidth;
    resizeTimeoutRef.current = window.setTimeout(() => {
      if (w != null) {
        setRowSize(
          Math.max(1, Math.floor((w - MARGIN_ADJUSTMENT) / CARD_WIDTH))
        );
      }
    }, 100);
  }, []);

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

  // holds all the elements currently displayed - gets rendered as
  // EventsPageEventCard, while null gets rendered as EventsPageEventCardGlimmer
  const display: (EventCardData | null)[] = events.slice(
    first,
    first + rowSize
  );
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
            aria-label="previous events"
            className={classes.button}
            onClick={prevPage}
          >
            <ChevronLeftIcon />
          </IconButton>
        </div>
      )}
      {display.map((event, i) => (
        <div className={classes.item} key={i}>
          {event != null ? (
            <EventsPageEventCard
              eventCardData={event}
              onClick={() => {
                void router.push(
                  config.pages.event(),
                  config.pages.event(event._id)
                );
              }}
            />
          ) : (
            <EventsPageEventCardGlimmer />
          )}
        </div>
      ))}
      {hasNext && !loading && (
        <div className={classes.nextButtonContainer}>
          <IconButton
            aria-label="next events"
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

export default EventsPageEventList;
