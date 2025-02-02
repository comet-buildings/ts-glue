import { Glue, is } from "ts-glue";
import {
  buildRoomsReferentialClient,
  type ApiConfiguration,
} from "./api-client/rooms-referential-client";
import type { RoomsReferentialClient } from "./rooms";

export const roomsGlue = Glue.buildFrom({
  roomsApiConfiguration: is<ApiConfiguration>,
  roomsReferentialClient: is<RoomsReferentialClient>,
});

export const setupRooms = roomsGlue.prepareSetup((glue) => {
  return glue.registerService(
    "roomsReferentialClient",
    glue.build(buildRoomsReferentialClient, ["roomsApiConfiguration"]),
  );
});
