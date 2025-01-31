import { fakeAvailabilitiesRepository } from "./availabilities/fake-availabilities-repository";
import { fakeRoomsReferentialClient } from "./rooms/fake-rooms-referential-client";
import { appGlue } from "./glue";
import { fakeUsersRepository } from "./users/fake-users-repository";

export const setupTests = appGlue.prepareSetup((glue) => {
  const configuredGlue = glue
    .registerService("availabilitiesRepository", fakeAvailabilitiesRepository)
    .registerService("roomsReferentialClient", fakeRoomsReferentialClient)
    .registerService("usersRepository", fakeUsersRepository)
    .registerService("roomsApiConfiguration", {
      roomsApiBaseUrl: "https://fake.api",
    })
    .registerService("databaseConfiguration", {
      dbUrl: "https://fake.db",
    });

  configuredGlue.checkAllServicesAreRegistered();

  return configuredGlue;
});
