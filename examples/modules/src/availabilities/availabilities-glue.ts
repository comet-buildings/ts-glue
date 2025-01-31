import { Glue, is } from "ts-glue";
import type { RoomsReferentialClient } from "../rooms/rooms";
import {
  type AvailabilitiesRepository,
  buildFindAvailabilities,
} from "./availabilities";
import {
  buildAvailabilitiesRepository,
  type DatabaseConfiguration,
} from "./db/availabilities-repository";
import {
  buildRoomsReferentialClient,
  type ApiConfiguration,
} from "../rooms/api-client/rooms-referential-client";

export const availabilitiesGlue = Glue.buildFrom({
  databaseConfiguration: is<DatabaseConfiguration>,
  availabilitiesRepository: is<AvailabilitiesRepository>,
  roomsApiConfiguration: is<ApiConfiguration>,
  roomsReferentialClient: is<RoomsReferentialClient>,
});

export const findAvailabilities = availabilitiesGlue.inject(
  buildFindAvailabilities,
  ["availabilitiesRepository", "roomsReferentialClient"],
);

export const setupAvailabilities = availabilitiesGlue.prepareSetup((glue) => {
  return glue
    .registerService(
      "availabilitiesRepository",
      glue.build(buildAvailabilitiesRepository, ["databaseConfiguration"]),
    )
    .registerService(
      "roomsReferentialClient",
      glue.build(buildRoomsReferentialClient, ["roomsApiConfiguration"]),
    );
});
