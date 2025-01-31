import { fakeAvailabilitiesRepository } from "./availabilities/fake-availabilities-repository";
import { appGlue } from "./glue";
import { fakeRoomsReferentialClient } from "./rooms/fake-rooms-referential-client";

export const setupTests = appGlue.prepareSetup((glue) => {
  const configuredGlue = glue
    .registerService("availabilitiesRepository", fakeAvailabilitiesRepository)
    .registerService("roomsReferentialClient", fakeRoomsReferentialClient)
    .registerService("roomsApiConfiguration", {
      roomsApiBaseUrl: "https://fake.api",
    })
    .registerService("databaseConfiguration", {
      dbUrl: "https://fake.db",
    });

  configuredGlue.checkAllServicesAreRegistered();

  return configuredGlue;
});
