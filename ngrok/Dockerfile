# Image 0: Download Ngrok
FROM debian:stretch-slim

RUN set -x \
    # Install ngrok (latest official stable from https://ngrok.com/download).
 && apt-get update \
 && apt-get install -y wget unzip \
 && wget -O /ngrok.zip https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip \
 && unzip /ngrok.zip

# Image 1: Final Ngrok Image
FROM debian:stretch-slim

# Copy ngrok exec to this image
COPY --from=0 /ngrok /bin/ngrok

# Create non-root user.
RUN set -x \
 && adduser --home /home/ngrok -u 6737 ngrok
RUN  ngrok --version

# Add config script.
COPY --chown=ngrok ngrok.yml /home/ngrok/.ngrok2/
COPY --chown=ngrok entrypoint.sh /

USER ngrok
ENV USER=ngrok

EXPOSE 4040

CMD [ "sh", "/entrypoint.sh" ]
