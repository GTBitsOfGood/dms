import React from "react";

import {
  NextPage,
  InferGetServerSidePropsType,
  GetServerSidePropsContext
} from "next";

import EventsPageFiltered from "components/events/EventsPageFiltered";
import EventsPageUnfiltered from "components/events/EventsPageUnfiltered";
import {
  getUpcomingEventsCardData,
  getFilteredEventsCardData
} from "server/actions/events";
import { getFilterValuesInQuery, getFilterCountFromQuery } from "utils/filters";

const EventsNextPage: NextPage<InferGetServerSidePropsType<
  typeof getServerSideProps
>> = props => {
  switch (props.type) {
    case "WITHOUT_QUERY":
      return (
        <EventsPageUnfiltered
          upcomingEventsFirstPageData={props.upcomingEventsFirstPageData}
        />
      );
    case "WITH_QUERY":
      return <EventsPageFiltered />;
    default: {
      const _exhaustiveCheck: never = props;
      return _exhaustiveCheck;
    }
  }
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // Don't remove the async otherwise InferGetStaticPropsType won't work as expected
  // TODO: Use this eventually, if we need common props between filtered and unfiltered event pages.
  const commonProps = {};

  if (getFilterCountFromQuery(context.query) === 0) {
    const date = new Date();
    const upcomingEventsFirstPageData = await getUpcomingEventsCardData({
      date: date.toJSON(),
      page: 0
    });

    return {
      props: {
        ...commonProps,
        upcomingEventsFirstPageData,
        type: "WITHOUT_QUERY" as const
      }
    };
  } else {
    const causes = getFilterValuesInQuery(context.query, "cause");
    const cities = getFilterValuesInQuery(context.query, "location");
    const times = getFilterValuesInQuery(context.query, "time");
    /*upcomingEventsFirstPageData =  await getByFilteredEventsCardData({
      causes,
      cities,
      times,
      // TO DO: ADD PAGE SUPPORT
    });*/
  }

  return {
    props: {
      ...commonProps,
      type: "WITH_QUERY" as const
    }
  };
};

export default EventsNextPage;
