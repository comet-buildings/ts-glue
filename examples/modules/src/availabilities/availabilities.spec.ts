import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { fakeRoomsReferentialClient } from "../rooms/fake-rooms-referential-client";
import { buildFindAvailabilities } from "./availabilities";
import { fakeAvailabilitiesRepository } from "./fake-availabilities-repository";

describe("Availabilities", () => {
  const findAvailabilities = buildFindAvailabilities(
    fakeAvailabilitiesRepository,
    fakeRoomsReferentialClient,
  );

  it("should match date and number of participants", async () => {
    // given
    const numberOfParticipants = 42;
    const date = DateTime.fromISO("2025-04-02");
    // when
    const foundAvailabilities = await findAvailabilities(
      date,
      numberOfParticipants,
    );
    // then
    expect(foundAvailabilities[0]?.room?.name).toEqual("petite salle");
  });
});
