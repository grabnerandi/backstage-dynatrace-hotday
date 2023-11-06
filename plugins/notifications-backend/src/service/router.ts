import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { DatabaseHandler } from '../lib';

export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { database } = options;

  const db = await database.getClient();
  const dbHandler = await DatabaseHandler.create({ database: db });

  const router = Router();
  router.use(express.json());

  router.get('/', async (_, response) => {
    response
      .json(await dbHandler.getAllNotifications())
      .status(200)
      .end();
  });

  router.post('/', async (req, response) => {
    await dbHandler.insertNotification(req.body);
    response.status(201).end();
  });

  router.use(errorHandler());
  return router;
}
