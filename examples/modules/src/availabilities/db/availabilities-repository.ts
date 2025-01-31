import type { AvailabilitiesRepository } from "../availabilities";

export type DatabaseConfiguration = {
  dbUrl: string;
};

export const buildAvailabilitiesRepository = (
  configuration: DatabaseConfiguration,
): AvailabilitiesRepository => {
  return {
    find: async (date, numberOfParticipants) => {
      throw new Error("DB connection error");
    },
  };
};
