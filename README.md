# Meraki Board

Meraki Board is a dashboard for multiple Meraki devices. It utilizes Elastic Stack, Ngrok and ReactJS libraries on a high level.

## Setup

### Setup VM

First, you will need a setup a VM to kickstart. The guide will assume you use a Ubuntu 18.04 VM.

You will need to make sure that your VM has at least the following specs.

| Specs  | Recommendations |
| ------ | --------------- |
| CPU    | 4 vCPU          |
| Memory | 16GB            |



### Install Docker

Ignore this section if you already have Docker Engine and Docker Compose. 

#### First, you will need to install [Docker Engine](https://docs.docker.com/engine/install/ubuntu/).

Older versions of Docker were called `docker`, `docker.io`, or `docker-engine`. If these are installed, uninstall them:

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

Set-up the repository for docker.
```bash
# Update the apt package index and install packages to allow apt to use a repository over HTTPS
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Verify that you now have the key with the fingerprint 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88, 
# by searching for the last 8 characters of the fingerprint.
sudo apt-key fingerprint 0EBFCD88

# Use the following command to set up the stable repository.
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

Finally, install Docker Engine
```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

#### Next, you will need to install [Docker Compose](https://docs.docker.com/compose/install/).

Download the binary

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Change the permission 
```
sudo chmod +x /usr/local/bin/docker-compose
```

### Docker Preferences
Note that we will be using Elastic Stack. It requires huge amount of memory and we need to allow Docker to consume as such.
```
# set with increased virtual memory
sudo sysctl -w vm.max_map_count=262144
```

## Starting Up

### Clone this repository
Feel free to clone the repository and explore the files.
```bash
git clone https://github.com/jseow-c/meraki-board
cd meraki-board
```

### Create Logstash Configurations
We need to get the configurations for Logstash ingestion. We will be using HTTP module in Logstash heavily. To this end, we have created some Python scripts that do that. More information can be found in the scripts themselves.

For now, the steps to create the configurations have been dockerized too.
```bash
cd ingest
sudo docker build -t packaged_python -q .
sudo docker-compose run --rm create_config
cd ..
```
You may check that the configurations are in place through the following command.
```bash
# check configs
sudo docker run -it --rm -v es_config:/usr/share/logstash/config busybox ls -l /usr/share/logstash/config
```

### Create Ngrok Image
[Ngrok](https://ngrok.com/) is a tool that we will use to expose our webhook and netflow collector IP. We need to build a ngrok image for consumption later. 

To create it, run the following command
```bash
cd ngrok
sudo docker build -t meraki-board/ngrok -q .
cd ..
```

### Create UI Dashboard Image
The dashboard will be the primary UI we will be viewing later. We need to build a UI image for consumption later. 

To create it, run the following command
```bash
cd ui
sudo docker build -t meraki-board/ui -q .
cd ..
```

### Remove all Intermediate Containers
As most of the images we create we utilize a multi-stage approach. We will need to remove any intermediate containers created as a result.

Remove all intermediate containers
```bash
sudo docker rmi \`sudo docker images -qa -f 'dangling=true'\`
```

### Bring up the Elastic Stack
We will then bring up the stack. It is created using the file `docker-compose.yml` in the root folder.

```bash
cd ..
sudo docker-compose up
```

We will check that the containers are created via the following commands:

```bash
sudo docker ps
```
You should see 9 containers created.

- 3 Elasticsearch
- 1 Kibana
- 1 Logstash
- 1 Filebeat
- 2 Ngrok
- 1 Meraki UI

### Check the Ngrok URLs
You will now need to check the Ngrok URLs in order to find out what to put into Meraki Settings later.

#### Get URL
Get Meraki Webhook URL
```bash
curl --noproxy "*" http://localhost:4040/api/tunnels | jq '.tunnels[].public_url'
```

Get Meraki Netflow URL
```bash
curl --noproxy "*" http://localhost:4041/api/tunnels | jq '.tunnels[].public_url'
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)