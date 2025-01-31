import type { UsersRepository } from "../users";

export type DatabaseConfiguration = {
  dbUrl: string;
};

export const buildUsersRepository = (
  configuration: DatabaseConfiguration,
): UsersRepository => {
  return {
    find: async () => {
      throw new Error("DB connection error");
    },
  };
};
