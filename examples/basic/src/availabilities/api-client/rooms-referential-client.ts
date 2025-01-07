import type { RoomsReferentialClient } from "../availabilities"

export type ApiConfiguration = {
    baseUrl: string
}

export const buildRoomsReferentialClient = (configuration: ApiConfiguration): RoomsReferentialClient => {
    return {
        findAll: async () => {
            throw new Error('api does not respond');
        },
    }
}