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

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Change the permission 
```bash
sudo chmod +x /usr/local/bin/docker-compose
```

### Docker Preferences
Note that we will be using Elastic Stack. It requires huge amount of memory and we need to allow Docker to consume as such.
```bash
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
sudo docker build . -t packaged_python
sudo docker-compose run --rm create_config
```
You may check that the configurations are in place through the following command.
```bash
# check configs
sudo docker run -it --rm -v es_config:/usr/share/logstash/config busybox ls -l /usr/share/logstash/config
```

### Bring up the Elastic Stack
We will then bring up the stack. It is created using the file `docker-compose.yml` in the root folder.

```bash
cd ..
sudo docker-compose up
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)