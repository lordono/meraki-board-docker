#!/usr/bin/env python3

import os
import math
import requests
from dotenv import load_dotenv

# load environment variables
load_dotenv()

# preferences
organizationId = os.environ.get("ORGANIZATION")
apiKey = os.environ.get("APIKEY")
baseUrl = os.environ.get("BASEURL")
targetFolder = os.environ.get("TARGETFOLDER")
print(organizationId)
print(apiKey)
print(baseUrl)
print(targetFolder)

# get networks
getDevicesUrl = "{}/organizations/{}/devices".format(baseUrl, organizationId)

headers = {
    'Accept': '*/*',
    'X-Cisco-Meraki-API-Key': apiKey
}

devices = requests.get(getDevicesUrl, headers=headers)
devicesJson = devices.json()

try:
    os.mkdir(targetFolder)
except OSError:
    print("Creation of the directory %s failed" % targetFolder)
else:
    print("Successfully created the directory %s " % targetFolder)

# starting input number for logstash
num = 1
startNum = 10
freq = 2

totalTime = 0
for device in devicesJson:
    if device['model'].startswith("MX"):
        totalTime += 3 * freq

numMin = math.ceil(totalTime / 60)
int5Min = math.ceil(numMin / 5) * 5

# create the files
for device in devicesJson:
    if device['model'].startswith("MX"):
        file1 = '{}/{:04d}-meraki-wan-link.conf'.format(
            targetFolder, startNum + num)
        file2 = '{}/{:04d}-meraki-performance.conf'.format(
            targetFolder, startNum + num + 1)
        file3 = '{}/{:04d}-meraki-latency.conf'.format(
            targetFolder, startNum + num + 2)
        try:
            with open(file1, 'w+') as f:
                firstMin = math.floor(num * freq / 60)
                lastMin = 60 - numMin + firstMin
                minute = "{}-{}/{}".format(
                    firstMin, lastMin, numMin)
                f.writelines([
                    'input {\n',
                    '  http_poller {\n',
                    '    urls => {\n',
                    '      rest_api => {\n',
                    '        method => get\n',
                    '        url => "{}/networks/{}/devices/{}/uplink"\n'.format(
                        baseUrl, device['networkId'], device['serial']),
                    '        headers => {\n',
                    '          Accept => "application/json"\n',
                    '          "X-Cisco-Meraki-API-Key" => "{}"\n'.format(
                        apiKey),
                    '        }\n',
                    '      }\n',
                    '    }\n',
                    '    \n',
                    '    request_timeout => 60\n',
                    '    schedule => {{ cron => "{} {} * * * * UTC"}}\n'.format(
                        (num * freq) % 60, minute),
                    '    codec => "json"\n',
                    '    type => "meraki-wan-link"\n',
                    '    add_field => {{ "serial" => "{}" }}\n'.format(
                        device['serial']),
                    '    add_field => {{ "network" => "{}" }}\n'.format(
                        device['networkId']),
                    '    add_field => {{ "model" => "{}" }}\n'.format(
                        device['model']),
                    '  }\n',
                    '}',
                ])			
            with open(file2, 'w+') as f:
                firstMin = math.floor((num + 1) * freq / 60)
                lastMin = 60 - numMin + firstMin
                minute = "{}-{}/{}".format(
                    firstMin, lastMin, numMin)
                
                f.writelines([
                    'input {\n',
                    '  http_poller {\n',
                    '    urls => {\n',
                    '      rest_api => {\n',
                    '        method => get\n',
                    '        url => "{}/networks/{}/devices/{}/performance"\n'.format(
                        baseUrl, device['networkId'], device['serial']),
                    '        headers => {\n',
                    '          Accept => "application/json"\n',
                    '          "X-Cisco-Meraki-API-Key" => "{}"\n'.format(
                        apiKey),
                    '        }\n',
                    '      }\n',
                    '    }\n',
                    '    \n',
                    '    request_timeout => 60\n',
                    '    schedule => {{ cron => "{} {} * * * * UTC"}}\n'.format(
                        ((num + 1) * freq) % 60, minute),
                    '    codec => "json"\n',
                    '    type => "meraki-performance"\n',
                    '    add_field => {{ "serial" => "{}" }}\n'.format(
                        device['serial']),
                    '    add_field => {{ "network" => "{}" }}\n'.format(
                        device['networkId']),
                    '    add_field => {{ "model" => "{}" }}\n'.format(
                        device['model']),
                    '  }\n',
                    '}',
                ])				
            with open(file3, 'w+') as f:
                firstMin = math.floor((num + 1) * freq / 60)
                lastMin = 60 - int5Min + firstMin
                minute = "{}-{}/{}".format(
                    firstMin, lastMin, int5Min)
                
                f.writelines([
                    'input {\n',
                    '  http_poller {\n',
                    '    urls => {\n',
                    '      rest_api => {\n',
                    '        method => get\n',
                    '        url => "{}/networks/{}/devices/{}/lossAndLatencyHistory?ip=8.8.8.8&timespan={}"\n'.format(
                        baseUrl, device['networkId'], device['serial'], int5Min * 60),
                    '        headers => {\n',
                    '          Accept => "application/json"\n',
                    '          "X-Cisco-Meraki-API-Key" => "{}"\n'.format(
                        apiKey),
                    '        }\n',
                    '      }\n',
                    '    }\n',
                    '    \n',
                    '    request_timeout => 60\n',
                    '    schedule => {{ cron => "{} {} * * * * UTC"}}\n'.format(
                        ((num + 2) * freq) % 60, minute),
                    '    codec => "json"\n',
                    '    type => "meraki-latency"\n',
                    '    add_field => {{ "serial" => "{}" }}\n'.format(
                        device['serial']),
                    '    add_field => {{ "network" => "{}" }}\n'.format(
                        device['networkId']),
                    '    add_field => {{ "model" => "{}" }}\n'.format(
                        device['model']),
                    '  }\n',
                    '}',
                ])
        except FileExistsError:
            print("File {} already exist".format(file1))
        else:
            print("File {} created".format(file1))
            print("File {} created".format(file2))
            print("File {} created".format(file3))
            num += 3
