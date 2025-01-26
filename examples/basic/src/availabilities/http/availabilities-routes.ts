import type { Router } from 'express';
import { findAvailabilities } from '../availabilities-di';
import { DateTime } from 'luxon';

export const availabilitiesRoutes = (router: Router) => {
  router.get('/availabilities', async (req, res) => {
    const date = req.query.date ? DateTime.fromISO(req.query.date) : DateTime.now();
    const numberOfParticipants = req.query.numberOfParticipants ? parseInt(req.query.numberOfParticipants) : NaN;
    if (isNaN(numberOfParticipants)) {
      return res.status(400).end()
    }
    const availabilities = await findAvailabilities(date, numberOfParticipants);
    res.json({ availabilities });
  });
};
