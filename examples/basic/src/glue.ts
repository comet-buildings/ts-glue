import { Glue, is } from "ts-glue";
import { buildAvailabilitiesRepository, type DatabaseConfiguration } from "./availabilities/db/availabilities-repository";
import { buildRoomsReferentialClient, type ApiConfiguration } from "./availabilities/api-client/rooms-referential-client";
import type { AvailabilitiesRepository, RoomsReferentialClient } from "./availabilities/availabilities";

export const appGlue = Glue.buildFrom({
  databaseConfiguration: is<DatabaseConfiguration>,
  apiConfiguration: is<ApiConfiguration>,
  availabilitiesRepository: is<AvailabilitiesRepository>,
  roomsReferentialClient: is<RoomsReferentialClient>
});

export const setupApp = appGlue.prepareSetup((glue) => {
  return glue
    .registerService(
      'availabilitiesRepository',
      glue.build(buildAvailabilitiesRepository, ['databaseConfiguration'])
    )
    .registerService(
      'roomsReferentialClient',
      glue.build(buildRoomsReferentialClient, ['apiConfiguration'])
    )
    .registerService('databaseConfiguration', { url: 'https://user@db.com' })
    .registerService('apiConfiguration', { baseUrl: 'https://rooms.api.comet.team' })
});