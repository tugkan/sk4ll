import Initializer from '@lib/initializer';
import Masscan from '@lib/masscan';

const App = {
    init: async () => {
        const cidrBlocks = Initializer.init();
        const { ports, pluginInfo } = await Initializer.initPlugins();
        Masscan.exec(cidrBlocks, ports, pluginInfo);
    },
};

App.init();

export default App;
