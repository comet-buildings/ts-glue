import type { RoomsReferentialClient } from "../rooms";

export type ApiConfiguration = {
  roomsApiBaseUrl: string;
};

export const buildRoomsReferentialClient = (
  configuration: ApiConfiguration,
): RoomsReferentialClient => {
  return {
    findAll: () => new Promise((_, reject) => setTimeout(reject, 5000)),
  };
};
