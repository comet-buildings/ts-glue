import { fakeAvailabilitiesRepository } from "./availabilities/fake-availabilities-repository";
import { fakeRoomsReferentialClient } from "./availabilities/fake-rooms-referential-client";
import { appGlue } from "./glue";

export const setupTests = appGlue.prepareSetup((glue) => {
    return glue
        .registerService('availabilitiesRepository', fakeAvailabilitiesRepository)
        .registerService('roomsReferentialClient', fakeRoomsReferentialClient)
        .registerService('databaseConfiguration', { url: 'https://fake.db' })
        .registerService('apiConfiguration', { baseUrl: 'https://fake.api' })
});