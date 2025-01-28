import type { DateTime } from "luxon";
import type { RoomsReferentialClient } from "../rooms/rooms";

type Availability = {
  id: string;
  room: { id: string; capacity: number };
  date: DateTime;
};
export type AvailabilitiesRepository = {
  find: (
    date: DateTime,
    numberOfParticipants: number,
  ) => Promise<Availability[]>;
};

export const buildFindAvailabilities =
  (
    availabilitiesRepository: AvailabilitiesRepository,
    roomsReferentialClient: RoomsReferentialClient,
  ) =>
  async (date: DateTime, numberOfParticipants: number) => {
    const availabilities = await availabilitiesRepository.find(
      date,
      numberOfParticipants,
    );
    const allRooms = await roomsReferentialClient.findAll();
    return availabilities.map((availability) => ({
      ...availability,
      room: allRooms.find((room) => room.id === availability.room.id),
    }));
  };
