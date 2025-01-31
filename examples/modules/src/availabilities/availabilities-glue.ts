import { Glue, is } from "ts-glue";
import {
  type AvailabilitiesRepository,
  buildFindAvailabilities,
} from "./availabilities";
import {
  buildAvailabilitiesRepository,
  type DatabaseConfiguration,
} from "./db/availabilities-repository";
import { setupRooms } from "../rooms/rooms-glue";

export const availabilitiesGlue = Glue.compose(
  Glue.buildFrom({
    databaseConfiguration: is<DatabaseConfiguration>,
    availabilitiesRepository: is<AvailabilitiesRepository>,
  }),
  setupRooms(),
);

export const findAvailabilities = availabilitiesGlue.inject(
  buildFindAvailabilities,
  ["availabilitiesRepository", "roomsReferentialClient"],
);

export const setupAvailabilities = availabilitiesGlue.prepareSetup((glue) => {
  return glue.registerService(
    "availabilitiesRepository",
    glue.build(buildAvailabilitiesRepository, ["databaseConfiguration"]),
  );
});
