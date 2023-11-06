import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import {
  Progress,
  ResponseErrorPanel,
  Select,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { notificationsApiRef } from '../../api';
import { useAsync } from 'react-use';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export const NotificationListComponent = () => {
  const [selectedChannel, setSelectedChannel] = useState('');
  const config = useApi(configApiRef);
  const notificationsApi = useApi(notificationsApiRef);
  const { value, loading, error } = useAsync(
    async () => notificationsApi.getNotifications(),
    [],
  );

  if (loading) {
    return <Progress />;
  } else if (error || !value) {
    return <ResponseErrorPanel error={error ?? new Error('No data found')} />;
  }

  const columns: TableColumn[] = [
    {
      title: 'Time',
      field: 'timestamp',
      type: 'string',
      render: (row: any, _) => new Date(row['timestamp']).toLocaleString(),
    },
    { title: 'Message', field: 'message' },
    { title: 'Channel', field: 'channel' },
    { title: 'Origin', field: 'origin' },
  ];

  const channels: string[] = [];
  value.forEach(notification => {
    if (!channels.includes(notification.channel)) {
      channels.push(notification.channel);
    }
  });
  return (
    <Grid container direction="row">
      <Grid item xs={2}>
        <Select
          label="Channel"
          items={channels.map(c => ({ label: c, value: c }))}
          selected={selectedChannel.toLocaleLowerCase('en-US')}
          onChange={value => setSelectedChannel(String(value))}
        />
      </Grid>
      <Grid item xs={10}>
        <Table
          options={{ paging: false, sorting: true }}
          data={value.filter(
            v => !selectedChannel || v.channel === selectedChannel,
          )}
          columns={columns}
          title="Notifications"
          emptyContent={
            <div style={{ textAlign: 'center' }}>
              <h2>No notifications to display.</h2>
              <p>
                Send notifications to{' '}
                <code>{config.getString('app.baseUrl')}/api/notifications</code>
                .
              </p>
            </div>
          }
        />
      </Grid>
    </Grid>
  );
};
