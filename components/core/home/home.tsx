import React from "react";

import { Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { signIn, signOut, useSession } from "next-auth/client";

import SimpleContainer from "@core/banner/Banner";
import FixedContainer from "@core/footer";
import NonprofitLandingCarousel from "@core/home/NonprofitLandingCarousel";
import CoreLink from "@core/link";
import CoreNavBar from "@core/navbar/CoreNavBar";
import { DatePaginatedEventCards, PaginatedNonprofitCards } from "utils/types";

import SupportCauseGrid from "./SupportCauseGrid";
import EventsPageEventList from "components/events/EventsPageEventList";
import { getUpcomingEvents } from "requests/events";

const useStyles = makeStyles({
  container: {
    display: "flex",
    minWidth: "420px",
    flexDirection: "column",
    alignSelf: "center"
  },
  text: {
    textAlign: "center",
    color: "#333333",
    margin: "5px 0px"
  },
  button: {
    width: "160px",
    alignSelf: "center",
    margin: "20px 0px"
  },
  upcomingEventsCarousel: {
    display: "flex",
    flexDirection: "column",
    "align-self": "center",
    "margin-top": "10vh",
    "margin-left": "5vh",
    "margin-right": "5vh"
  },
  upcomingEventsHeading: {
    marginBottom: 20
  },
  carousel: {
    alignSelf: "center",
    marginBottom: 10
  },
  heading: {
    align: "left",
    marginLeft: 48,
    marginTop: 200,
    marginBottom: 25,
    color: "#333333"
  },
  allLink: {
    marginTop: 20,
    float: "right"
  }
});

interface Props {
  nonprofitCards: PaginatedNonprofitCards;
  upcomingEvents: DatePaginatedEventCards;
}

const Home: React.FC<Props> = props => {
  const [session] = useSession();
  const { container, text, button, carousel, upcomingEventsCarousel, heading, allLink, upcomingEventsHeading } = useStyles();

  return (
    <div className={container}>
      <CoreNavBar />
      <SimpleContainer />
      <div className={upcomingEventsCarousel}>
        <Typography className={upcomingEventsHeading} variant="h2">
          Upcoming Volunteer Events
        </Typography>
        <div>
          <EventsPageEventList
            paginatedEventCardsData={props.upcomingEvents}
            getMoreEvents={(page: number) =>
              getUpcomingEvents({
                page,
                date: props.upcomingEvents.date
              })
            }
          />
          <CoreLink href={"/events"} className={allLink}>
            {"All Events Here ->"}
          </CoreLink>
        </div>
      </div>
      <SupportCauseGrid />
      <div className={carousel}>
        <Typography className={heading} variant="h2">
          New Non-Profits on Our Platform
        </Typography>
        <NonprofitLandingCarousel nonprofitCards={props.nonprofitCards} />
        <CoreLink href={"/"} className={allLink}>
          {"All Non-Profits Here ->"}
        </CoreLink>
      </div>
      <FixedContainer />
    </div>
  );
};

export default Home;
