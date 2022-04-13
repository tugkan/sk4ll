const fs = require('fs');
const path = require('path');
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs/yargs');
const EventService = require('../event-service');
const Logger = require('../logger');

const { argv } = yargs(hideBin(process.argv));

const EventEmitter = EventService.getInstance();

const Initializer = {
    print: {},
    argv: {},
};

Initializer.initPlugins = async () => {
    let plugins;
    if (!argv.plugin || argv.plugin === 'all') {
        plugins = await fs.promises.readdir(
            path.join(__dirname, '..', '..', 'plugins'),
        );
    } else {
        plugins = argv.plugin.split(',');
    }

    let ports = [];
    const pluginInfo = {};
    Logger.debug(`Found ${plugins.length} plugins`);
    for (const plugin of plugins) {
        const pluginPath = path.join(__dirname, '..', '..', 'plugins', plugin);
        const Plugin = require(pluginPath); // eslint-disable-line
        EventEmitter.on(`scan.${Plugin.service}`, Plugin.init);
        ports = ports.concat(Plugin.ports);
        Logger.debug(`Initialized plugin: ${Plugin.name}`);

        for (const port of Plugin.ports) {
            pluginInfo[port] = Plugin.service;
        }
    }

    Logger.info(`Loaded ${plugins.length} plugin(s)`);
    Logger.info(`Port(s): ${ports.join(',')}`);

    return { ports, pluginInfo };
};

Initializer.getCidrBlocks = () => {
    if (!argv.cidrBlocks && !argv.cidrFiles) {
        Logger.error('Please provide at least one CIDR block with --cidr-blocks or --cidr-files');
        process.exit();
    }

    if (argv.cidrBlocks) {
        const blocks = Array.isArray(argv.cidrBlocks) ? argv.cidrBlocks : [argv.cidrBlocks];
        Logger.info(`Loaded ${blocks.length} CIDR blocks`);
        Logger.debug(`CIDR_BLOCKS: ${blocks}`);
        return blocks;
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
    if (!argv.p && !argv.proxy) {
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
    --plugin                  Plugins to use. Example: redis,mongo,mysql. Default is "all"
    -l, --log-level            Log level. Example: info
  `);
};

Initializer.argv = argv;

Initializer.init = () => {
    Initializer.print.header();
    if (argv.h || argv.help) {
        Initializer.print.help();
        process.exit(0);
    }
    Initializer.print.proxy();
    const cidrBlocks = Initializer.getCidrBlocks();

    return cidrBlocks;
};

module.exports = Initializer;
