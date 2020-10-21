import { Client } from "@googlemaps/google-maps-services-js";

import config from "config";
import Mongo from "server/index";
import Event from "server/models/event";
import Nonprofit from "server/models/nonprofit";
import errors from "utils/errors";
import {
  Event as EventType,
  EventCardData as EventCardDataType,
  DatePaginatedEventCards,
  DatePageRequest,
  LocationPaginatedEventCards,
  LocationPageRequest,
  FilterPageRequest
} from "utils/types";

const CARD_FIELDS: Record<keyof EventCardDataType, 1> = {
  name: 1,
  startDate: 1,
  endDate: 1,
  image: 1,
  address: 1,
  nonprofitId: 1,
  duration: 1,
  _id: 1
};
const MILLISECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;
const NEAREST_EVENTS_RADIUS = 20 / 3959; // radius for nearest events in radians (20 miles / earth's radius)

export async function getUpcomingEventsCardData({
  date,
  page
}: DatePageRequest): Promise<DatePaginatedEventCards> {
  const CARDS_PER_PAGE = 4;
  await Mongo();

  const result = await Event.find(
    {
      startDate: {
        $gte: new Date(date),
        $lte: new Date(new Date(date).getTime() + MILLISECONDS_IN_WEEK)
      }
    },
    CARD_FIELDS
  )
    .sort({ startDate: 1 })
    .skip(page * CARDS_PER_PAGE)
    .limit(CARDS_PER_PAGE + 1); // get one more than required so that we can check if this is the last page

  return {
    cards: result
      .slice(0, CARDS_PER_PAGE)
      .map(r => r.toJSON()) as EventCardDataType[],
    page,
    date,
    isLastPage: result.length < CARDS_PER_PAGE + 1
  };
}

export async function getNearestEventsCardData({
  lat,
  long,
  page
}: LocationPageRequest): Promise<LocationPaginatedEventCards> {
  const CARDS_PER_PAGE = 4;
  await Mongo();

  const result = await Event.find(
    {
      "address.location": {
        $geoWithin: {
          $centerSphere: [[long, lat], NEAREST_EVENTS_RADIUS]
        }
      }
    },
    CARD_FIELDS
  )
    .skip(page * CARDS_PER_PAGE)
    .limit(CARDS_PER_PAGE + 1); // get one more than required so that we can check if this is the last page

  return {
    cards: result
      .slice(0, CARDS_PER_PAGE)
      .map(r => r.toJSON()) as EventCardDataType[],
    page,
    lat,
    long,
    isLastPage: result.length < CARDS_PER_PAGE + 1
  };
}

export async function getFilteredEventsCardData({
  causes,
  cities,
  times,
  page,
  totalCount
}: FilterPageRequest) {
  const CARDS_PER_PAGE = 16;
  await Mongo();

  const findQuery = await createFilter({ causes, cities, times });

  const result = await Event.find(findQuery, CARD_FIELDS)
    .skip(page * CARDS_PER_PAGE)
    .limit(CARDS_PER_PAGE);
  return {
    cards: result.map(r => r.toJSON()) as EventCardDataType[],
    page,
    totalCount,
    cities,
    causes,
    times,
    isLastPage: totalCount - (page + 1) * CARDS_PER_PAGE <= 0
  };
}

export async function getFilteredEventsCardDataCount({
  causes,
  cities,
  times
}: Pick<FilterPageRequest, "causes" | "cities" | "times">) {
  await Mongo();
  const findQuery = await createFilter({ causes, cities, times });
  return Event.countDocuments(findQuery);
}

const createFilter = async ({
  causes,
  cities,
  times
}: Pick<FilterPageRequest, "causes" | "cities" | "times">) => {
  let findQuery = {};
  if (causes.length) {
    const idsWithCause = await Nonprofit.find(
      {
        cause: { $in: causes }
      },
      "nonprofitId"
    );

    findQuery = {
      ...findQuery,
      nonprofitId: { $in: idsWithCause.map(r => r["_id"]) }
    };
  }
  if (cities.length) {
    const bounds = await getCityPolygonCoordinates(cities);

    findQuery = {
      ...findQuery,
      "address.location": {
        $geoWithin: {
          $geometry: {
            type: "MultiPolygon",
            coordinates: bounds
          }
        }
      }
    };
  }

  if (times.length) {
    const timeFilters = times.map(time => {
      let startTime = new Date();
      startTime.setHours(0);
      startTime.setMinutes(0);
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
      let endTime;
      switch (time) {
        case "TODAY": {
          endTime = new Date(startTime);
          endTime.setDate(startTime.getDate() + 1);
          break;
        }
        case "TOMORROW": {
          startTime.setDate(startTime.getDate() + 1);
          endTime = new Date(startTime);
          endTime.setDate(startTime.getDate() + 1);
          break;
        }
        case "WEEKEND": {
          const offset = startTime.getDay() == 0 ? -1 : 6 - startTime.getDay();
          startTime.setDate(startTime.getDate() + offset);
          endTime = new Date(startTime);
          endTime.setDate(startTime.getDate() + 2);
          break;
        }
        case "NWEEKEND": {
          const offset = startTime.getDay() == 0 ? -1 : 6 - startTime.getDay();
          startTime.setDate(startTime.getDate() + offset + 7);
          endTime = new Date(startTime);
          endTime.setDate(startTime.getDate() + 2);
          break;
        }
        case "NWEEK": {
          startTime = new Date();
          startTime.setDate(startTime.getDate() + 7);
          endTime = new Date(startTime);
          endTime.setDate(startTime.getDate() + 7);
          break;
        }
        case "WEEK": {
          startTime = new Date();
          endTime = new Date(startTime);
          endTime.setDate(startTime.getDate() + 7);
          break;
        }
        default: {
          const _exhaustiveCheck: never = time;
          return _exhaustiveCheck;
        }
      }
      return {
        startDate: {
          $gte: startTime,
          $lt: endTime
        }
      };
    });
    findQuery = {
      ...findQuery,
      $or: timeFilters
    };
  }
  return findQuery;
};

export async function getEventById(_id: string): Promise<EventType> {
  await Mongo();

  const event = await Event.findById(_id);

  if (event == null) {
    throw new Error(errors.event.INVALID_ID);
  }

  return event.toJSON() as EventType;
}

export async function getAllEventIds(): Promise<string[]> {
  await Mongo();

  return Event.distinct("_id").exec();
}

function getCityPolygonCoordinates(cities: string[]) {
  const client = new Client({});

  return Promise.all(
    cities.map(async city => {
      const geocode = await client.geocode({
        params: {
          address: city, // space delineated street address of location
          components: "country:US",
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          key: config.googleMaps.serverKey!
        }
      });

      const viewport = geocode.data.results[0].geometry.viewport;

      const north = viewport.northeast.lng;
      const east = viewport.northeast.lat;
      const south = viewport.southwest.lng;
      const west = viewport.southwest.lat;

      return [
        [
          [north, east],
          [south, east],
          [south, west],
          [north, west],
          [north, east] // duplicate the first one in order to create a closed loop for mongo
        ]
      ];
    })
  );
}
