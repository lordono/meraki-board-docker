#!/bin/bash

# send environment variables into the default file where cron can read
env >> /etc/environment

# start cronjob
cron -f
