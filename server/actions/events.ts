import Mongo from "server/index";
import Event from "server/models/event";
import Nonprofit from "server/models/nonprofit";
import errors from "utils/errors";
import {
  Coordinates,
  Event as EventType,
  EventCardData as EventCardDataType,
  DatePaginatedEventCards,
  DatePageInformation,
  LocationPaginatedEventCards,
  LocationPageInformation
} from "utils/types";
import { Client } from "@googlemaps/google-maps-services-js";
import config from "config";

const CARD_FIELDS: Record<keyof EventCardDataType, 1> = {
  name: 1,
  startDate: 1,
  endDate: 1,
  image: 1,
  address: 1,
  nonprofitId: 1,
  duration: 1
};
const CARDS_PER_PAGE = 4;
const MILLISECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;
const NEAREST_EVENTS_RADIUS = 20 / 3959; // radius for nearest events in radians (20 miles / earth's radius)

export async function getUpcomingEventsCardData({
  date,
  page,
  totalCount
}: DatePageInformation): Promise<DatePaginatedEventCards> {
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
    .populate("nonprofitId", "name", Nonprofit)
    .sort({ startDate: 1 })
    .skip(page > 0 ? (page - 1) * CARDS_PER_PAGE : 0)
    .limit(CARDS_PER_PAGE);

  return {
    eventCards: result.map(r => r.toJSON()) as EventCardDataType[],
    page,
    totalCount,
    date,
    isLastPage: totalCount - (page + 1) * CARDS_PER_PAGE <= 0
  };
}

export async function getUpcomingEventsCardDataCount(date: Date) {
  await Mongo();

  return Event.countDocuments({
    startDate: {
      $gte: date,
      $lte: new Date(date.getTime() + MILLISECONDS_IN_WEEK)
    }
  });
}

export async function getNearestEventsCardData({
  location,
  page,
  totalCount
}: LocationPageInformation): Promise<LocationPaginatedEventCards> {
  await Mongo();

  if (totalCount == -1) {
    totalCount = await getNearestEventsCardDataCount(location);
  }

  const result = await Event.find(
    {
      "address.location": {
        $geoWithin: {
          $centerSphere: [[location.long, location.lat], NEAREST_EVENTS_RADIUS]
        }
      }
    },
    CARD_FIELDS
  )
    .populate("nonprofitId", "name", Nonprofit)
    .skip(page > 0 ? (page - 1) * CARDS_PER_PAGE : 0)
    .limit(CARDS_PER_PAGE);

  return {
    eventCards: result.map(r => r.toJSON()) as EventCardDataType[],
    page,
    totalCount,
    location,
    isLastPage: totalCount - (page + 1) * CARDS_PER_PAGE <= 0
  };
}

export async function getNearestEventsCardDataCount({
  lat,
  long
}: LocationPageInformation["location"]) {
  await Mongo();

  return Event.countDocuments({
    "address.location": {
      $geoWithin: {
        $centerSphere: [[long, lat], NEAREST_EVENTS_RADIUS]
      }
    }
  });
}

export async function getByCausesEventsCardData(causes: string[]) {
  await Mongo();

  const idsWithCause = await Nonprofit.find(
    {
      cause: { $in: causes }
    },
    "nonprofitId"
  );

  const result = await Event.find({
    nonprofitId: { $in: idsWithCause.map(r => r["_id"]) }
  }).limit(5);

  return result.map(r => r.toJSON()) as EventCardDataType[];
}

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

export function getCityPolygonCoordinates(cities: string[]) {
  const client = new Client({});

  return Promise.all(
    cities.map(async city => {
      const geocode = await client.geocode({
        params: {
          address: city, // space delineated street address of location
          key: config.googleMapsKey === undefined ? "" : config.googleMapsKey
        },
        timeout: 1000 // milliseconds
      });

      const location = geocode.data.results[0].geometry.location;

      return {
        lat: location.lat,
        long: location.lng
      };
    })
  );
}
