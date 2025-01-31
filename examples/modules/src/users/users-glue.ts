import { Glue, is } from "ts-glue";
import type { UsersRepository } from "./users";
import {
  buildUsersRepository,
  type DatabaseConfiguration,
} from "./db/users-repository";

export const usersGlue = Glue.buildFrom({
  databaseConfiguration: is<DatabaseConfiguration>,
  usersRepository: is<UsersRepository>,
});

export const setupUsers = usersGlue.prepareSetup((glue) => {
  return glue.registerService(
    "usersRepository",
    glue.build(buildUsersRepository, ["databaseConfiguration"]),
  );
});
