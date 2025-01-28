import { fakeAvailabilitiesRepository } from "./availabilities/fake-availabilities-repository";
import { fakeRoomsReferentialClient } from "./rooms/fake-rooms-referential-client";
import { appGlue } from "./glue";

export const setupTests = appGlue.prepareSetup((glue) => {
  const configuredGlue = glue
    .registerService("availabilitiesRepository", fakeAvailabilitiesRepository)
    .registerService("roomsReferentialClient", fakeRoomsReferentialClient)
    .registerService("serverConfiguration", {
      url: "https://fake.db",
      baseUrl: "https://fake.api",
    });

  configuredGlue.checkAllServicesAreRegistered();

  return configuredGlue;
});
