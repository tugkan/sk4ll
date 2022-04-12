#!/usr/bin/env node
const Initializer = require('../src/lib/initializer');
const Masscan = require('../src/lib/masscan');

async function init() {
    const cidrBlocks = Initializer.init();
    const { ports, pluginInfo } = await Initializer.initPlugins();
    Masscan.exec(cidrBlocks, ports, pluginInfo);
}

init();
