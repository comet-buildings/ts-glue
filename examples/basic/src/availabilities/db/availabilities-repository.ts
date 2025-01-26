import type { AvailabilitiesRepository } from "../availabilities"

export type DatabaseConfiguration = {
    url: string
}

export const buildAvailabilitiesRepository = (configuration: DatabaseConfiguration): AvailabilitiesRepository => {
    return {
        find: async (date, numberOfParticipants) => new Promise((_, reject) => setTimeout(reject, 5000)),
    }
}