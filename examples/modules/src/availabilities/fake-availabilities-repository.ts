import type { DateTime } from "luxon";
import type { AvailabilitiesRepository } from "./availabilities";

export const fakeAvailabilitiesRepository: AvailabilitiesRepository = {
  find: async (date: DateTime, numberOfParticipants: number) => [
    {
      id: "12345",
      date,
      room: {
        id: "small_room_id",
        capacity: 12,
      },
    },
  ],
};
