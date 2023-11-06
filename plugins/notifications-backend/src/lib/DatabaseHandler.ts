import { resolvePackagePath } from '@backstage/backend-common';
import { Knex } from 'knex';
import { Notification } from '@internal/plugin-notifications/src/api/types';

const migrationsDir = resolvePackagePath(
  '@internal/plugin-notifications-backend',
  'migrations',
);

type Options = {
  database: Knex;
};

export class DatabaseHandler {
  private readonly database: Knex;

  private constructor(options: Options) {
    this.database = options.database;
  }

  static async create(options: Options): Promise<DatabaseHandler> {
    const { database } = options;

    await database.migrate.latest({
      directory: migrationsDir,
    });

    return new DatabaseHandler(options);
  }

  async getAllNotifications(): Promise<string[]> {
    return await this.database('notifications');
  }

  async insertNotification(notification: Notification) {
    await this.database('notifications').insert({
      message: notification.message,
      channel: notification.channel,
      origin: notification.origin,
    });
  }
}
