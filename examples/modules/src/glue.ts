import { setupAvailabilities } from "./availabilities/availabilities-glue";

export const appGlue = setupAvailabilities();

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
