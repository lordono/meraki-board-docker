FROM debian:stretch-slim

#############################################################
# Install Curator
#############################################################

# Add key for curator
RUN set -x \
 && apt-get update \
 && apt-get install -y wget gnupg2 apt-transport-https ca-certificates cron \
 && wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | apt-key add - 

COPY elastic-curator.list /etc/apt/sources.list.d/elastic-curator.list
COPY .env /var/curator/.env

# Install curator (latest official stable from https://www.elastic.co/guide/en/elasticsearch/client/curator/current/apt-repository.html).
RUN set -x \
 && . /var/curator/.env \
 && apt-get update && apt-get install elasticsearch-curator

# add user if it is not added
RUN set -x \
 && adduser --home /home/curator -u 6738 curator 



#############################################################
# Setup for Cron
#############################################################

USER root

# Copy delete-cron file to the cron.d directory
COPY --chown=curator delete-cron /etc/cron.d/delete-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/delete-cron

# Create cron log
RUN touch /var/log/curator-delete.log

# Apply cron job
RUN crontab /etc/cron.d/delete-cron

# allow user to run crond
RUN chown curator:curator /usr/sbin/cron
RUN chown curator:curator /var/run


#############################################################
# Run Command
#############################################################

# Copy in configuration and shell script for startup
COPY --chown=curator delete_old.yml /home/curator
COPY --chown=curator start-cron.sh /home/curator/start-cron.sh
RUN chmod 0644 /etc/cron.d/delete-cron

CMD [ "sh", "/home/curator/start-cron.sh" ]
	
# CMD [ "tail", "-f",  "/dev/null" ]

# CMD [ "/usr/bin/curator", "/home/curator/delete_old.yml" ]
