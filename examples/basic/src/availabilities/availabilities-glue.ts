import type { DateTime } from 'luxon'
import { buildFindAvailabilities } from './availabilities'
import { appGlue } from '../glue'

export const findAvailabilities = appGlue.inject(buildFindAvailabilities, ['availabilitiesRepository', 'roomsReferentialClient'])