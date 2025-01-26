import type { DateTime } from 'luxon'
import { buildFindAvailabilities } from './availabilities'
import { buildAvailabilitiesRepository, DatabaseConfiguration } from './db/availabilities-repository'
import { ApiConfiguration, buildRoomsReferentialClient } from './api-client/rooms-referential-client';

const databaseConfiguration: DatabaseConfiguration = { url: 'https://user@db.com' };
const apiConfiguration: ApiConfiguration  = { baseUrl: 'https://rooms.api.comet.team' };


const availabilitiesRepository = buildAvailabilitiesRepository(databaseConfiguration);
const roomsReferentialClient = buildRoomsReferentialClient(apiConfiguration);

export const findAvailabilities = buildFindAvailabilities(availabilitiesRepository, roomsReferentialClient)