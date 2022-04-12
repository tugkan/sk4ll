const { exec } = require('child_process');
const EventService = require('../event-service');
const Logger = require('../logger');

const EventEmitter = EventService.getInstance();

const Masscan = {};

const getIP = (data) => {
    return data.split('on ')[1];
};

const getPort = (data) => {
    return parseInt(data.match(/\d+\/tcp/g)[0].replace('/tcp', ''), 10);
};

Masscan.exec = (cidrBlocks, ports, pluginInfo) => {
    Logger.info('Initiating masscan');
    Logger.debug(`Executing masscan with CIDR blocks: ${cidrBlocks} and ports: ${ports}`);

    const child = exec(`masscan -p${ports.join(',')} ${cidrBlocks}`);
    child.stdout.on('data', async (data) => {
        const messages = data.split('\n')
            .map((message) => message.trim())
            .filter((message) => message.length > 0);

        for (const message of messages) {
            const foundIp = getIP(message);
            const foundPort = getPort(message);

            Logger.debug(`Scanning vulnerable services on: ${foundIp}:${foundPort}`);
            const service = pluginInfo[foundPort];

            if (service) {
                Logger.verbose(`Found possible vulnerable ${service} service on: ${foundIp}:${foundPort}`);
                EventEmitter.emit(`scan.${service}`, {
                    ip: foundIp,
                    port: foundPort,
                });
            }
        }
    });
    child.on('exit', () => {
        process.exit();
    });
};

module.exports = Masscan;
