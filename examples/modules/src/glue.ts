import { Glue, is } from "ts-glue";
import { setupAvailabilities } from "./availabilities/availabilities-glue";
import { setupRooms } from "./rooms/rooms-glue";

export const appGlue = Glue.compose(
  Glue.buildFrom({ serverConfiguration: is<ServerConfiguration> }),
  setupAvailabilities(),
  setupRooms(),
);

export const setupApp = appGlue.prepareSetup((glue) => {
  return glue.registerService("serverConfiguration", parseConfiguration());
});

type ServerConfiguration = { url: string; baseUrl: string };
const parseConfiguration = () => {
  return {
    url: "https://user@db.com",
    baseUrl: "https://rooms.api.comet.team",
  };
};
