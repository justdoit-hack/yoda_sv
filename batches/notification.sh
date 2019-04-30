#!/bin/sh

export NODE_ENV=production
cd /home/wintu/yoda_server
/usr/local/n/versions/node/8.16.0/bin/node scripts/cron_tasks/send_new_message_notification.js >/dev/null 2>&1