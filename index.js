import 'dotenv/config';
import Initializer from '@helpers/initializer';
import Masscan from '@scanners/masscan';

async function init() {
    const { cidrBlocks, ports } = Initializer.init();
    Masscan.exec(cidrBlocks, ports);
    Initializer.initListeners();
}

init();
