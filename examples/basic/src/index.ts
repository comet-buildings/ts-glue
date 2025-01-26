
import express from 'express';
import Router from 'express-promise-router';
import { availabilitiesRoutes } from './availabilities/http/availabilities-routes';

const app = express()
const port = 3000

const apiRouter = Router();
app.use('/api', apiRouter);
availabilitiesRoutes(apiRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
