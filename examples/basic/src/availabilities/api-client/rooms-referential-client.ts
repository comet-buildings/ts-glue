import type { RoomsReferentialClient } from "../availabilities"

export type ApiConfiguration = {
    baseUrl: string
}

export const buildRoomsReferentialClient = (configuration: ApiConfiguration): RoomsReferentialClient => {
    return {
        findAll: () => new Promise((_, reject) => setTimeout(reject, 5000))
    }
}