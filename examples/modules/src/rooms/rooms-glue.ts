// export const roomsGlue = Glue.buildFrom({
//   roomsApiConfiguration: is<ApiConfiguration>,
//   roomsReferentialClient: is<RoomsReferentialClient>,
// });

// export const setupRooms = roomsGlue.prepareSetup((glue) => {
//   return glue.registerService(
//     "roomsReferentialClient",
//     glue.build(buildRoomsReferentialClient, ["roomsApiConfiguration"]),
//   );
// });
