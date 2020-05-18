FROM debian:stretch-slim

RUN set -x \
    # Install curator (latest official stable from https://www.elastic.co/guide/en/elasticsearch/client/curator/current/apt-repository.html).
 && apt-get update \
 && apt-get install -y wget \
 && wget -qO - https://packages.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add - \
 && deb [arch=amd64] https://packages.elastic.co/curator/5/debian stable main \
 && sudo apt-get update && sudo apt-get install elasticsearch-curator

RUN set -x \
 && adduser -h /home/curator -D -u 6738 curator

USER curator

COPY --chown=curator delete_old.yml /home/curator

CMD [ "/usr/bin/curator", "/home/curator/delete_old.yml" ]