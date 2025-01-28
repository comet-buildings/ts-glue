import type { RoomsReferentialClient } from "./rooms";

export const fakeRoomsReferentialClient: RoomsReferentialClient = {
  findAll: async () => [
    {
      id: "small_room_id",
      name: "petite salle",
      capacity: 12,
    },
    {
      id: "big_room_id",
      name: "grande salle",
      capacity: 42,
    },
  ],
};
