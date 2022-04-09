import fs from 'fs';
import EventService from '@helpers/event-service';
import Logger from '@helpers/logger';
import Mongo from '@scanners/mongo';
import Redis from '@scanners/redis';
import Mysql from '@scanners/mysql';
import HTMLParser from '@scanners/html-parser';

import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

const { argv } = yargs(hideBin(process.argv));

const EventEmitter = EventService.getInstance();

const Initializer = {
    print: {},
};

Initializer.argv = argv;

Initializer.getCidrBlocks = () => {
    if (!argv.cidrBlocks && !argv.cidrFiles) {
        Logger.error('Please provide at least one CIDR block with --cidr-blocks or --cidr-files');
        process.exit();
    }

    if (argv.cidrBlocks) {
        Logger.info(`Loaded ${argv.cidrBlocks.length} blocks`);
        Logger.debug(`CIDR_BLOCKS: ${argv.cidrBlocks}`);
        return argv.cidrBlocks;
    }

    if (argv.cidrFiles) {
        let blocks = [];
        const files = argv.cidrFiles.split(',');
        for (const file of files) {
            try {
                const data = fs.readFileSync(file.trim()).toString();
                const parsed = data.split('\n');
                blocks = blocks.concat(parsed);
            } catch (error) {
                Logger.error('Please provide a valid cidr file.');
            }
        }

        Logger.info(`Loaded ${argv.cidrFiles.length} blocks`);
        Logger.debug(`CIDR_BLOCKS: ${argv.cidrFiles}`);
        return blocks.join(',');
    }
};

Initializer.getPorts = () => {
    if (!argv.ports) {
        Logger.error('Please provide a valid port. Example: 80,443,8080');
        process.exit();
    }

    Logger.debug(`Parsing ports`);

    const parsedPorts = `${argv.ports}`.split(',').map((port) => parseInt(`${port}`.trim(), 10));

    if (parsedPorts.filter((port) => !Number.isInteger(port)).length > 0) {
        Logger.error('Please provide a valid port. Example: 80,443,8080');
        process.exit();
    }

    Logger.info(`Loaded ${parsedPorts.length} ports`);
    Logger.debug(`Ports: ${parsedPorts}`);
    return parsedPorts;
};

Initializer.initListeners = () => {
    EventEmitter.on(EventService.constants.scanner.mongo.scan, Mongo.exec);
    EventEmitter.on(EventService.constants.scanner.html.scan, HTMLParser.parse);
    EventEmitter.on(EventService.constants.scanner.redis.scan, Redis.exec);
    EventEmitter.on(EventService.constants.scanner.mysql.scan, Mysql.exec);
};

Initializer.print.header = () => {
    Logger.info(`

                 kkkkkkkk               444444444  lllllll lllllll
                 k::::::k              4::::::::4  l:::::l l:::::l
                 k::::::k             4:::::::::4  l:::::l l:::::l
                 k::::::k            4::::44::::4  l:::::l l:::::l
    ssssssssss    k:::::k    kkkkkkk4::::4 4::::4   l::::l  l::::l
  ss::::::::::s   k:::::k   k:::::k4::::4  4::::4   l::::l  l::::l
ss:::::::::::::s  k:::::k  k:::::k4::::4   4::::4   l::::l  l::::l
s::::::ssss:::::s k:::::k k:::::k4::::444444::::444 l::::l  l::::l
 s:::::s  ssssss  k::::::k:::::k 4::::::::::::::::4 l::::l  l::::l
   s::::::s       k:::::::::::k  4444444444:::::444 l::::l  l::::l
      s::::::s    k:::::::::::k            4::::4   l::::l  l::::l
ssssss   s:::::s  k::::::k:::::k           4::::4   l::::l  l::::l
s:::::ssss::::::sk::::::k k:::::k          4::::4  l::::::ll::::::l
s::::::::::::::s k::::::k  k:::::k       44::::::44l::::::ll::::::l
 s:::::::::::ss  k::::::k   k:::::k      4::::::::4l::::::ll::::::l
  sssssssssss    kkkkkkkk    kkkkkkk     4444444444llllllllllllllll


--------------------------------------------------------------------------------
This is a script that will help you to find possible vulnerable services
on the given CIDR blocks within the given ports.
--------------------------------------------------------------------------------
  `);
};

Initializer.print.proxy = () => {
    if (argv.p || argv.proxy) {
        Logger.info('No proxy is provided. Might be problematic...');
    } else {
        Logger.info('Proxy loaded');
    }
};

Initializer.print.help = () => {
    Logger.info(`
Options:
------------------------------------------------
    -h, --help                 Prints this help
    -p, --proxy                Proxy URL to use
    -c, --cidr                 CIDR blocks to scan. Example: 10.10.10.10/8,10.10.10.11/16
    -f, --cidr-files           CIDR files to scan. Example: ./data/cidr.json,./data/cidr1.json
    -P, --ports                Ports to scan. Example: 80,443,8080
    -l, --log-level            Log level. Example: info
  `);
};

Initializer.init = () => {
    Initializer.print.header();
    if (argv.h || argv.help) {
        Initializer.print.help();
        process.exit(0);
    }
    Initializer.print.proxy();
    const cidrBlocks = Initializer.getCidrBlocks();
    const ports = Initializer.getPorts();

    return {
        cidrBlocks,
        ports,
    };
};

export default Initializer;
