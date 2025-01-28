import type { Router } from "express";
import { findAvailabilities } from "../availabilities-glue";
import { DateTime } from "luxon";

export const availabilitiesRoutes = (router: Router) => {
  router.get("/availabilities", async (req, res) => {
    const date = req.query.date
      ? DateTime.fromISO(req.query.date)
      : DateTime.now();
    const numberOfParticipants = req.query.numberOfParticipants
      ? Number.parseInt(req.query.numberOfParticipants)
      : Number.NaN;
    if (Number.isNaN(numberOfParticipants)) {
      return res.status(400).end();
    }
    const availabilities = await findAvailabilities(date, numberOfParticipants);
    res.json({ availabilities });
  });
};
