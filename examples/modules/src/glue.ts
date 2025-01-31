import { Glue } from "ts-glue";
import { setupAvailabilities } from "./availabilities/availabilities-glue";
import { setupUsers } from "./users/users-glue";

export const appGlue = Glue.compose(setupAvailabilities(), setupUsers());

export const setupApp = appGlue.prepareSetup((glue) => {
  const config = parseConfiguration();

  return glue
    .registerService("databaseConfiguration", config)
    .registerService("roomsApiConfiguration", config);
});

const parseConfiguration = () => {
  return {
    dbUrl: "https://user@db.com",
    roomsApiBaseUrl: "https://rooms.api.comet.team",
  };
};
