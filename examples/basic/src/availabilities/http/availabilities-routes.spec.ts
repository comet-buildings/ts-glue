import express from 'express';
import Router from 'express-promise-router';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { setupTests } from '../../glue-test';
import { availabilitiesRoutes } from './availabilities-routes';

describe('Availabilities routes', () => {
  const app = express();
  const router = Router();
  app.use('/api', router);
  availabilitiesRoutes(router);
  setupTests().checkAllServicesAreRegistered();

  it('should return 400 when no number of participants', async () => {
    // given // when
    const response = await request(app).get('/api/availabilities');
    // then
    expect(response.status).toEqual(400);
  });

  it('should return availabilities', async () => {
    // given // when
    const response = await request(app).get('/api/availabilities?numberOfParticipants=2');
    // then
    expect(response.status).toEqual(200);
    expect(response.body.availabilities).toHaveLength(1);
  });
});