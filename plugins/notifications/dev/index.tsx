import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { notificationsPlugin, NotificationsPage } from '../src';

createDevApp()
  .registerPlugin(notificationsPlugin)
  .addPage({
    element: <NotificationsPage />,
    title: 'Root Page',
    path: '/notifications',
  })
  .render();
