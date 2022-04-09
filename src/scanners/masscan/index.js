import { exec } from 'child_process';
import EventService from '@helpers/event-service';
import Logger from '@helpers/logger';

import VULN_SERVICES from './vuln-services';

const EventEmitter = EventService.getInstance();

const Masscan = {};

const getIP = (data) => {
    return data.split('on ')[1];
};

const getPort = (data) => {
    return parseInt(data.match(/\d+\/tcp/g)[0].replace('/tcp', ''), 10);
};

const detectVulnerableServices = (currentIp, currentPort) => {
    Logger.debug(`Scanning vulnerable services on: ${currentIp}:${currentPort}`);
    for (const service of VULN_SERVICES) {
        if (service.port === currentPort) {
            Logger.verbose(`Found possible vulnerable ${service.service} service on: ${currentIp}:${currentPort}`);
            EventEmitter.emit(EventService.constants.scanner[service.method].scan, {
                ip: currentIp,
                port: currentPort,
            });
        }
    }
};

Masscan.exec = (cidrBlocks, ports) => {
    Logger.info('Initiating masscan');
    Logger.debug(`Executing masscan with CIDR blocks: ${cidrBlocks} and ports: ${ports}`);
    const child = exec(`masscan -p${ports.join(',')} ${cidrBlocks}`);
    child.stdout.on('data', async (data) => {
        const messages = data.split('\n')
            .map((message) => message.trim())
            .filter((message) => message.length > 0);
        for (const message of messages) {
            const currentIp = getIP(message);
            const currentPort = getPort(message);
            detectVulnerableServices(currentIp, currentPort);
        }
    });
    child.on('exit', () => {
        process.exit();
    });
};

export default Masscan;
